import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  avatar?: string;
  isVerified: boolean;
  role: 'user' | 'admin';
  preferences: {
    riskTolerance: 'low' | 'medium' | 'high';
    preferredProtocols: string[];
    notifications: {
      email: boolean;
      push: boolean;
      yield: boolean;
      security: boolean;
    };
  };
  portfolio: {
    totalValue: number;
    positions: mongoose.Types.ObjectId[];
    performance: {
      daily: number;
      weekly: number;
      monthly: number;
      yearly: number;
    };
  };
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema = new Schema<IUser>({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [50, 'Name cannot be more than 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false
  },
  avatar: {
    type: String,
    default: ''
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  preferences: {
    riskTolerance: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium'
    },
    preferredProtocols: [{
      type: String
    }],
    notifications: {
      email: { type: Boolean, default: true },
      push: { type: Boolean, default: false },
      yield: { type: Boolean, default: true },
      security: { type: Boolean, default: true }
    }
  },
  portfolio: {
    totalValue: { type: Number, default: 0 },
    positions: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Portfolio'
    }],
    performance: {
      daily: { type: Number, default: 0 },
      weekly: { type: Number, default: 0 },
      monthly: { type: Number, default: 0 },
      yearly: { type: Number, default: 0 }
    }
  }
}, {
  timestamps: true
});

// Hash password before saving
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method
UserSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  return await bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model<IUser>('User', UserSchema);
