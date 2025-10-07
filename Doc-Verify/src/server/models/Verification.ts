import mongoose, { Schema, Document } from 'mongoose';

export interface IVerification extends Document {
  document: mongoose.Types.ObjectId;
  requestedBy: mongoose.Types.ObjectId;
  status: 'in-progress' | 'completed' | 'failed';
  verificationSteps: {
    step: string;
    status: 'pending' | 'in-progress' | 'completed' | 'failed';
    result?: boolean;
    details?: string;
    timestamp: Date;
  }[];
  completedAt?: Date;
}

const VerificationSchema: Schema = new Schema({
  document: {
    type: Schema.Types.ObjectId,
    ref: 'Document',
    required: true,
  },
  requestedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  status: {
    type: String,
    enum: ['in-progress', 'completed', 'failed'],
    default: 'in-progress',
  },
  verificationSteps: [{
    step: {
      type: String,
      enum: [
        'ocrVerification',
        'databaseValidation',
        'keywordScanning',
        'textAlignmentCheck',
        'watermarkFontCheck'
      ],
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'in-progress', 'completed', 'failed'],
      default: 'pending',
    },
    result: Boolean,
    details: String,
    timestamp: {
      type: Date,
      default: Date.now,
    },
  }],
  completedAt: Date,
}, {
  timestamps: true,
});

// Add index for quick lookups
VerificationSchema.index({ document: 1, requestedBy: 1 });

export default mongoose.model<IVerification>('Verification', VerificationSchema);