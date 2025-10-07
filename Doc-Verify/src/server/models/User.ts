import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';
import { PasswordValidator } from '../utils/passwordValidator';

export interface IUser extends Document {
  email: string;
  password: string;
  name: string;
  userType: 'university' | 'student' | 'company' | 'government';
  institution?: string;
  registrationNumber?: string;
  isActive: boolean;
  isEmailVerified: boolean;
  lastLogin?: Date;
  refreshToken?: string;
  passwordResetToken?: string;
  passwordResetExpires?: Date;
  failedLoginAttempts: number;
  lockUntil?: Date;
  verifyPassword(password: string): Promise<boolean>;
  incrementLoginAttempts(): Promise<void>;
  resetLoginAttempts(): Promise<void>;
}

const UserSchema: Schema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    validate: {
      validator: function(email: string) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      },
      message: 'Invalid email format'
    }
  },
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: [2, 'Name must be at least 2 characters long'],
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  userType: {
    type: String,
    required: true,
    enum: {
      values: ['university', 'student', 'company', 'government'],
      message: '{VALUE} is not a valid user type'
    }
  },
  institution: {
    type: String,
    trim: true,
    required: function(this: IUser) {
      return ['university', 'student'].includes(this.userType);
    }
  },
  registrationNumber: {
    type: String,
    trim: true,
    required: function(this: IUser) {
      return ['university', 'company'].includes(this.userType);
    }
  },
  password: {
    type: String,
    required: true,
    validate: {
      validator: function(password: string) {
        const validation = PasswordValidator.validate(password);
        return validation.isValid;
      },
      message: () => PasswordValidator.generateRequirementsMessage()
    }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  lastLogin: {
    type: Date
  },
  refreshToken: {
    type: String
  },
  passwordResetToken: {
    type: String
  },
  passwordResetExpires: {
    type: Date
  },
  failedLoginAttempts: {
    type: Number,
    default: 0
  },
  lockUntil: {
    type: Date
  }
}, {
  timestamps: true
});

// Hash password before saving
UserSchema.pre('save', async function(this: IUser & Document, next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

// Method to verify password
UserSchema.methods.verifyPassword = async function(password: string): Promise<boolean> {
  return bcrypt.compare(password, this.password);
};

export default mongoose.model<IUser>('User', UserSchema);