import mongoose, { Document, Schema } from 'mongoose';

export interface IYield extends Document {
  platform: string;
  token: string;
  apy: number;
  tvl: string;
  riskScore: number;
  category: 'lending' | 'dex' | 'yield-farming' | 'liquid-staking';
  chainId: number;
  contractAddress?: string;
  audits: string[];
  lastUpdated: Date;
  metrics: {
    dailyVolume: number;
    weeklyVolume: number;
    totalUsers: number;
  };
}

const YieldSchema = new Schema<IYield>({
  platform: { type: String, required: true, index: true },
  token: { type: String, required: true, index: true },
  apy: { type: Number, required: true, min: 0 },
  tvl: { type: String, required: true },
  riskScore: { type: Number, required: true, min: 0, max: 1 },
  category: { 
    type: String, 
    required: true, 
    enum: ['lending', 'dex', 'yield-farming', 'liquid-staking'],
    index: true 
  },
  chainId: { type: Number, required: true, default: 1 },
  contractAddress: { type: String, sparse: true },
  audits: [{ type: String }],
  lastUpdated: { type: Date, default: Date.now },
  metrics: {
    dailyVolume: { type: Number, default: 0 },
    weeklyVolume: { type: Number, default: 0 },
    totalUsers: { type: Number, default: 0 }
  }
}, {
  timestamps: true
});

// Compound index for efficient querying
YieldSchema.index({ platform: 1, token: 1 }, { unique: true });
YieldSchema.index({ apy: -1 });
YieldSchema.index({ riskScore: -1 });

export default mongoose.model<IYield>('Yield', YieldSchema);
