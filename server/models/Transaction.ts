import mongoose, { Document, Schema } from 'mongoose';

export interface ITransaction extends Document {
  userId: mongoose.Types.ObjectId;
  type: 'deposit' | 'withdraw' | 'reward' | 'swap' | 'compound';
  platform: string;
  token: string;
  amount: number;
  value: number; // USD value at time of transaction
  txHash?: string;
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  gasUsed?: number;
  gasFee?: number;
  blockNumber?: number;
  fromAddress?: string;
  toAddress?: string;
  metadata: {
    strategyId?: mongoose.Types.ObjectId;
    portfolioId?: mongoose.Types.ObjectId;
    notes?: string;
    pricePerToken?: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

const TransactionSchema = new Schema<ITransaction>({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  type: {
    type: String,
    enum: ['deposit', 'withdraw', 'reward', 'swap', 'compound'],
    required: true,
    index: true
  },
  platform: {
    type: String,
    required: true,
    trim: true,
    index: true
  },
  token: {
    type: String,
    required: true,
    uppercase: true,
    trim: true,
    index: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  value: {
    type: Number,
    required: true,
    min: 0
  },
  txHash: {
    type: String,
    sparse: true,
    unique: true,
    lowercase: true
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'cancelled'],
    default: 'pending',
    index: true
  },
  gasUsed: {
    type: Number,
    min: 0
  },
  gasFee: {
    type: Number,
    min: 0
  },
  blockNumber: {
    type: Number,
    min: 0
  },
  fromAddress: {
    type: String,
    lowercase: true
  },
  toAddress: {
    type: String,
    lowercase: true
  },
  metadata: {
    strategyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Strategy'
    },
    portfolioId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Portfolio'
    },
    notes: {
      type: String,
      maxlength: 500
    },
    pricePerToken: {
      type: Number,
      min: 0
    }
  }
}, {
  timestamps: true
});

// Compound indexes for efficient querying
TransactionSchema.index({ userId: 1, createdAt: -1 });
TransactionSchema.index({ userId: 1, type: 1, status: 1 });
TransactionSchema.index({ platform: 1, createdAt: -1 });
TransactionSchema.index({ status: 1, createdAt: -1 });

// Virtual for calculating fees as percentage
TransactionSchema.virtual('feePercentage').get(function() {
  if (this.gasFee && this.value) {
    return (this.gasFee / this.value) * 100;
  }
  return 0;
});

export default mongoose.model<ITransaction>('Transaction', TransactionSchema);
