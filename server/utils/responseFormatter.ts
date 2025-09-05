import { Response } from 'express';

export interface ApiResponse<T = any> {
  status: 'success' | 'error';
  message: string;
  data?: T;
  error?: any;
  timestamp: string;
}

export const successResponse = <T>(
  res: Response,
  data: T,
  message: string = 'Operation successful',
  statusCode: number = 200
): Response<ApiResponse<T>> => {
  return res.status(statusCode).json({
    status: 'success',
    message,
    data,
    timestamp: new Date().toISOString(),
  });
};

export const errorResponse = (
  res: Response,
  message: string = 'Operation failed',
  statusCode: number = 500,
  error?: any
): Response<ApiResponse> => {
  return res.status(statusCode).json({
    status: 'error',
    message,
    error: process.env.NODE_ENV === 'development' ? error : undefined,
    timestamp: new Date().toISOString(),
  });
};

export class AppError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode: number = 500) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}
