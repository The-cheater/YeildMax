import { Router } from 'express';
import { strategyController } from '../controllers/strategyController';
import { authMiddleware } from '../middlewares/authMiddleware';
import { validateRequest } from '../middlewares/validateRequest';
import Joi from 'joi';

const router = Router();

// Validation schemas
const createStrategySchema = Joi.object({
  name: Joi.string().min(5).max(100).required(),
  description: Joi.string().min(10).max(500).required(),
  category: Joi.string().valid('conservative', 'balanced', 'aggressive', 'specialized', 'ai-powered').required(),
  expectedAPY: Joi.number().min(0).max(1000).required(),
  riskLevel: Joi.string().valid('low', 'medium', 'high').required(),
  minInvestment: Joi.number().min(0).required(),
  protocols: Joi.array().items(Joi.string()).min(1).required(),
  allocations: Joi.array().items(
    Joi.object({
      protocol: Joi.string().required(),
      percentage: Joi.number().min(0).max(100).required()
    })
  ).required()
});

const executeStrategySchema = Joi.object({
  amount: Joi.number().positive().required(),
  slippage: Joi.number().min(0).max(5).default(0.5)
});

// Public routes - Browse strategies
router.get('/', strategyController.getAllStrategies.bind(strategyController));
router.get('/featured', strategyController.getFeaturedStrategies.bind(strategyController));
router.get('/categories', strategyController.getCategories.bind(strategyController));
router.get('/:id', strategyController.getStrategyById.bind(strategyController));
router.get('/:id/performance', strategyController.getStrategyPerformance.bind(strategyController));

// Protected routes - Require authentication
router.use(authMiddleware);

// User strategy management
router.get('/user/following', strategyController.getUserFollowedStrategies.bind(strategyController));
router.get('/user/created', strategyController.getUserCreatedStrategies.bind(strategyController));
router.post('/:id/follow', strategyController.followStrategy.bind(strategyController));
router.delete('/:id/unfollow', strategyController.unfollowStrategy.bind(strategyController));

// Strategy execution
router.post('/:id/execute',
  validateRequest(executeStrategySchema),
  strategyController.executeStrategy.bind(strategyController)
);

router.get('/:id/execution-history', strategyController.getExecutionHistory.bind(strategyController));

// Strategy creation (for advanced users)
router.post('/',
  validateRequest(createStrategySchema),
  strategyController.createStrategy.bind(strategyController)
);

router.put('/:id',
  validateRequest(createStrategySchema.fork(['name', 'description'], (schema) => schema.optional())),
  strategyController.updateStrategy.bind(strategyController)
);

router.delete('/:id', strategyController.deleteStrategy.bind(strategyController));

// Strategy analytics
router.get('/:id/analytics', strategyController.getStrategyAnalytics.bind(strategyController));
router.post('/:id/backtest', strategyController.backtestStrategy.bind(strategyController));

export default router;
