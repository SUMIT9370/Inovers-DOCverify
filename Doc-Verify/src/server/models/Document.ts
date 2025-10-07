import mongoose, { Schema, Document } from 'mongoose';

export interface IDocument extends Document {
  title: string;
  type: string;
  isGovernmental: boolean;
  fileUrl: string;
  issuedBy: mongoose.Types.ObjectId;
  issuedTo?: mongoose.Types.ObjectId;
  issueDate: Date;
  metadata: {
    documentNumber: string;
    institution: string;
    [key: string]: any;
  };
  status: 'pending' | 'verified' | 'rejected';
  verificationResults: {
    ocrVerification: boolean;
    databaseValidation: boolean;
    keywordScanning: boolean;
    textAlignmentCheck: boolean;
    watermarkFontCheck: boolean;
  };
}

const DocumentSchema: Schema = new Schema({
  title: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  isGovernmental: {
    type: Boolean,
    required: true,
    default: false,
  },
  fileUrl: {
    type: String,
    required: true,
  },
  issuedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  issuedTo: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  issueDate: {
    type: Date,
    default: Date.now,
  },
  metadata: {
    documentNumber: {
      type: String,
      required: true,
    },
    institution: {
      type: String,
      required: true,
    },
    additionalInfo: Schema.Types.Mixed,
  },
  status: {
    type: String,
    enum: ['pending', 'verified', 'rejected'],
    default: 'pending',
  },
  verificationResults: {
    ocrVerification: {
      type: Boolean,
      default: null,
    },
    databaseValidation: {
      type: Boolean,
      default: null,
    },
    keywordScanning: {
      type: Boolean,
      default: null,
    },
    textAlignmentCheck: {
      type: Boolean,
      default: null,
    },
    watermarkFontCheck: {
      type: Boolean,
      default: null,
    },
  },
}, {
  timestamps: true,
});

export default mongoose.model<IDocument>('Document', DocumentSchema);