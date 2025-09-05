import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';

// Route imports
import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';
import yieldRoutes from './routes/yieldRoutes';
import portfolioRoutes from './routes/portfolioRoutes';
import strategyRoutes from './routes/strategyRoutes';
import transactionRoutes from './routes/transactionRoutes';

// Middleware imports
import { errorHandler } from './middlewares/errorHandler';
import { corsMiddleware } from './middlewares/corsMiddleware';
import logger from './utils/logger';

class App {
  public app: Application;

  constructor() {
    this.app = express();
    this.initializeMiddlewares();
    this.initializeRoutes();
    this.initializeErrorHandling();
  }

  private initializeMiddlewares(): void {
    // Security middlewares
    this.app.use(helmet());
    this.app.use(corsMiddleware);
    this.app.use(compression());

    // Rate limiting
    const limiter = rateLimit({
      windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 minutes
      max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),
      message: 'Too many requests from this IP, please try again later.',
      standardHeaders: true,
      legacyHeaders: false,
    });
    this.app.use(limiter);

    // Body parsing middlewares
    this.app.use(express.json({ limit: '10mb' }));
    this.app.use(express.urlencoded({ extended: true, limit: '10mb' }));

    // Logging middleware
    this.app.use((req: Request, res: Response, next: NextFunction) => {
      logger.info(`${req.method} ${req.path} - ${req.ip}`);
      next();
    });
  }

  private initializeRoutes(): void {
    const apiVersion = process.env.API_VERSION || 'v1';
    
    // Health check
    this.app.get(`/api/${apiVersion}/health`, (req: Request, res: Response) => {
      res.status(200).json({
        status: 'success',
        message: 'YieldMax API is running',
        timestamp: new Date().toISOString(),
        version: apiVersion
      });
    });

    // API routes
    this.app.use(`/api/${apiVersion}/auth`, authRoutes);
    this.app.use(`/api/${apiVersion}/users`, userRoutes);
    this.app.use(`/api/${apiVersion}/yields`, yieldRoutes);
    this.app.use(`/api/${apiVersion}/portfolios`, portfolioRoutes);
    this.app.use(`/api/${apiVersion}/strategies`, strategyRoutes);
    this.app.use(`/api/${apiVersion}/transactions`, transactionRoutes);

    // 404 handler
    this.app.all('*', (req: Request, res: Response) => {
      res.status(404).json({
        status: 'error',
        message: `Route ${req.originalUrl} not found`
      });
    });
  }

  private initializeErrorHandling(): void {
    this.app.use(errorHandler);
  }
}

export default new App().app;
