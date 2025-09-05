import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/User';
import { AppError } from '../utils/responseFormatter';

export interface AuthResponse {
  user: Partial<IUser>;
  token: string;
}

export class AuthService {
  private generateToken(userId: string): string {
    return jwt.sign({ userId }, process.env.JWT_SECRET!, {
      expiresIn: process.env.JWT_EXPIRE || '7d'
    });
  }

  async register(userData: {
    name: string;
    email: string;
    password: string;
  }): Promise<AuthResponse> {
    // Check if user already exists
    const existingUser = await User.findOne({ email: userData.email });
    if (existingUser) {
      throw new AppError('User already exists with this email', 400);
    }

    // Create new user
    const user = await User.create(userData);

    // Generate token
    const token = this.generateToken(user._id.toString());

    // Remove password from response
    const userResponse = {
      _id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      isVerified: user.isVerified,
      preferences: user.preferences,
      createdAt: user.createdAt
    };

    return { user: userResponse, token };
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    // Find user with password
    const user = await User.findOne({ email }).select('+password');
    
    if (!user || !(await user.comparePassword(password))) {
      throw new AppError('Invalid email or password', 401);
    }

    // Generate token
    const token = this.generateToken(user._id.toString());

    // Remove password from response
    const userResponse = {
      _id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      isVerified: user.isVerified,
      preferences: user.preferences,
      portfolio: user.portfolio
    };

    return { user: userResponse, token };
  }

  async getUserById(userId: string): Promise<IUser | null> {
    return await User.findById(userId).populate('portfolio.positions');
  }

  verifyToken(token: string): { userId: string } {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
      return decoded;
    } catch (error) {
      throw new AppError('Invalid token', 401);
    }
  }
}

export const authService = new AuthService();
