import { Request, Response } from 'express';
import mongoose from 'mongoose';
import Document from '../models/Document';
import Verification, { IVerification } from '../models/Verification';
import { IUser } from '../models/User';

// Extend Express Request type
declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';

// Configure S3 client (you'll need to set these environment variables)
const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'your-region',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || 'your-access-key',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || 'your-secret-key',
  },
});

const BUCKET_NAME = process.env.AWS_BUCKET_NAME || 'your-bucket-name';

// File upload middleware
export const upload = multer({
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

export const uploadDocument = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file provided' });
    }

    const { title, type, isGovernmental, metadata } = req.body;
    const file = req.file;

    // Generate unique filename
    const fileKey = `documents/${uuidv4()}-${file.originalname}`;

    // Upload to S3
    await s3Client.send(new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: fileKey,
      Body: file.buffer,
      ContentType: file.mimetype,
    }));

    // Create document record
    const document = new Document({
      title,
      type,
      isGovernmental: isGovernmental === 'true',
      fileUrl: `https://${BUCKET_NAME}.s3.amazonaws.com/${fileKey}`,
      issuedBy: req.userId,
      metadata: JSON.parse(metadata),
    });

    await document.save();

    res.status(201).json(document);
  } catch (error) {
    res.status(500).json({ error: 'Error uploading document' });
  }
};

export const uploadBulkDocuments = async (req: Request, res: Response) => {
  try {
    const { documents } = req.body;
    const uploadedDocuments = await Document.insertMany(
      documents.map((doc: any) => ({
        ...doc,
        issuedBy: req.userId,
      }))
    );

    res.status(201).json(uploadedDocuments);
  } catch (error) {
    res.status(500).json({ error: 'Error uploading bulk documents' });
  }
};

export const verifyDocument = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const { documentId } = req.params;

    const document = await Document.findById(documentId).exec();
    if (!document) {
      return res.status(404).json({ error: 'Document not found' });
    }

    // Create a new verification document
    const verification = await Verification.create({
      document: document._id,
      requestedBy: req.user._id,
      status: 'in-progress' as const,
      verificationSteps: ['upload', 'format', 'content', 'metadata'].map(step => ({
        step,
        status: 'pending' as const,
        timestamp: new Date(),
      })),
    });

    const verificationId = verification._id as unknown as mongoose.Types.ObjectId;

    // Start mock verification process
    startVerificationProcess(verificationId.toString());

    res.json({ message: 'Verification process started', verificationId: verificationId });
  } catch (error) {
    res.status(500).json({ error: 'Error starting verification' });
  }
};

// Mock verification process
const startVerificationProcess = async (verificationId: string) => {
  const verification = await Verification.findById(verificationId);
  if (!verification) return;

  const steps = [
    'ocrVerification',
    'databaseValidation',
    'keywordScanning',
    'textAlignmentCheck',
    'watermarkFontCheck'
  ];

  for (const step of steps) {
    // Update step status to in-progress
    const stepIndex = verification.verificationSteps.findIndex(s => s.step === step);
    verification.verificationSteps[stepIndex].status = 'in-progress';
    await verification.save();

    // Mock processing time (2-4 seconds)
    await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 2000));

    // Mock result (80% success rate)
    const success = Math.random() < 0.8;
    verification.verificationSteps[stepIndex].status = 'completed';
    verification.verificationSteps[stepIndex].result = success;
    verification.verificationSteps[stepIndex].details = success
      ? `${step} completed successfully`
      : `${step} failed verification`;
    await verification.save();

    if (!success) {
      verification.status = 'failed';
      await verification.save();
      return;
    }
  }

  // All steps completed successfully
  verification.status = 'completed';
  verification.completedAt = new Date();
  await verification.save();

  // Update document status
  await Document.findByIdAndUpdate(verification.document, {
    status: 'verified',
    verificationResults: verification.verificationSteps.reduce((acc: any, step) => {
      acc[step.step] = step.result;
      return acc;
    }, {}),
  });
};