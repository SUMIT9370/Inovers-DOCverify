import { Request, Response } from 'express';
import Document from '../models/Document';
import Verification from '../models/Verification';

export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    const stats = {
      totalDocuments: 0,
      pendingVerifications: 0,
      completedVerifications: 0,
      failedVerifications: 0,
    };

    // Get document stats based on user type
    switch (req.userType) {
      case 'university':
        stats.totalDocuments = await Document.countDocuments({ issuedBy: req.userId });
        break;
      case 'student':
        stats.totalDocuments = await Document.countDocuments({ issuedTo: req.userId });
        break;
      case 'company':
        // Companies can see documents they've verified
        stats.totalDocuments = await Verification.countDocuments({ requestedBy: req.userId });
        break;
      case 'government':
        // Government can see all documents
        stats.totalDocuments = await Document.countDocuments();
        break;
    }

    // Get verification stats
    const verifications = await Verification.find(
      req.userType === 'government' ? {} : { requestedBy: req.userId }
    );

    stats.pendingVerifications = verifications.filter(v => v.status === 'in-progress').length;
    stats.completedVerifications = verifications.filter(v => v.status === 'completed').length;
    stats.failedVerifications = verifications.filter(v => v.status === 'failed').length;

    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching dashboard stats' });
  }
};

export const getVerificationHistory = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const query = req.userType === 'government' ? {} : { requestedBy: req.userId };

    const verifications = await Verification.find(query)
      .populate('document')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await Verification.countDocuments(query);

    res.json({
      verifications,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        page,
        limit,
      },
    });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching verification history' });
  }
};

export const getPendingDocuments = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    interface DocumentQuery {
      status: string;
      issuedBy?: string;
      issuedTo?: string;
      _id?: { $in: any[] };
    }

    let query: DocumentQuery = { status: 'pending' };

    // Add user-specific filters
    switch (req.userType) {
      case 'university':
        query = { ...query, issuedBy: req.userId };
        break;
      case 'student':
        query = { ...query, issuedTo: req.userId };
        break;
      case 'company':
        // Companies see documents they're verifying
        const verifications = await Verification.find({
          requestedBy: req.userId,
          status: 'in-progress',
        }).select('document');
        query = {
          ...query,
          _id: { $in: verifications.map(v => v.document) },
        };
        break;
      // Government can see all pending documents
    }

    const documents = await Document.find(query)
      .populate('issuedBy', 'name institution')
      .populate('issuedTo', 'name')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await Document.countDocuments(query);

    res.json({
      documents,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        page,
        limit,
      },
    });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching pending documents' });
  }
};