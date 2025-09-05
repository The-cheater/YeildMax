import mongoose, { Document, Schema } from 'mongoose';

export interface IStrategy extends Document {
  name: string;
  description: string;
  category: 'conservative' | 'balanced' | 'aggressive' | 'specialized' | 'ai-powered';
  expectedAPY: number;
  riskLevel: 'low' | 'medium' | 'high';
  minInvestment: number;
  protocols: string[];
  allocations: {
    protocol: string;
    percentage: number;
  }[];
  followers: number;
  performance: {
    oneMonth: number;
    threeMonths: number;
    sixMonths: number;
    oneYear: number;
  };
  isActive: boolean;
  creator: mongoose.Types.ObjectId;
}

const StrategySchema = new Schema<IStrategy>({
  name: { type: String, required: true, trim: true, maxlength: 100 },
  description: { type: String, required: true, maxlength: 500 },
  category: {
    type: String,
    required: true,
    enum: ['conservative', 'balanced', 'aggressive', 'specialized', 'ai-powered'],
    index: true
  },
  expectedAPY: { type: Number, required: true, min: 0 },
  riskLevel: {
    type: String,
    required: true,
    enum: ['low', 'medium', 'high'],
    index: true
  },
  minInvestment: { type: Number, required: true, min: 0 },
  protocols: [{ type: String, required: true }],
  allocations: [{
    protocol: { type: String, required: true },
    percentage: { type: Number, required: true, min: 0, max: 100 }
  }],
  followers: { type: Number, default: 0, min: 0 },
  performance: {
    oneMonth: { type: Number, default: 0 },
    threeMonths: { type: Number, default: 0 },
    sixMonths: { type: Number, default: 0 },
    oneYear: { type: Number, default: 0 }
  },
  isActive: { type: Boolean, default: true },
  creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, {
  timestamps: true
});

// Validation to ensure allocations sum to 100%
StrategySchema.pre('save', function(next) {
  const totalAllocation = this.allocations.reduce((sum, alloc) => sum + alloc.percentage, 0);
  if (Math.abs(totalAllocation - 100) > 0.01) {
    throw new Error('Allocations must sum to 100%');
  }
  next();
});

export default mongoose.model<IStrategy>('Strategy', StrategySchema);
