import mongoose, { Document, Schema } from 'mongoose';

export interface IPortfolioPosition {
  platform: string;
  token: string;
  amount: number;
  initialValue: number;
  currentValue: number;
  apy: number;
  startDate: Date;
  lastUpdated: Date;
  transactions: mongoose.Types.ObjectId[];
}

export interface IPortfolio extends Document {
  userId: mongoose.Types.ObjectId;
  totalValue: number;
  positions: IPortfolioPosition[];
  performance: {
    daily: number;
    weekly: number;
    monthly: number;
    yearly: number;
  };
  riskScore: number;
  lastRebalance: Date;
}

const PortfolioPositionSchema = new Schema<IPortfolioPosition>({
  platform: { type: String, required: true },
  token: { type: String, required: true },
  amount: { type: Number, required: true, min: 0 },
  initialValue: { type: Number, required: true, min: 0 },
  currentValue: { type: Number, required: true, min: 0 },
  apy: { type: Number, required: true, min: 0 },
  startDate: { type: Date, default: Date.now },
  lastUpdated: { type: Date, default: Date.now },
  transactions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Transaction' }]
});

const PortfolioSchema = new Schema<IPortfolio>({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  totalValue: { type: Number, default: 0, min: 0 },
  positions: [PortfolioPositionSchema],
  performance: {
    daily: { type: Number, default: 0 },
    weekly: { type: Number, default: 0 },
    monthly: { type: Number, default: 0 },
    yearly: { type: Number, default: 0 }
  },
  riskScore: { type: Number, default: 0, min: 0, max: 1 },
  lastRebalance: { type: Date, default: Date.now }
}, {
  timestamps: true
});

export default mongoose.model<IPortfolio>('Portfolio', PortfolioSchema);
