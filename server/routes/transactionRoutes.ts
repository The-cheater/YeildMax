import { Router } from 'express';
import { transactionController } from '../controllers/transactionController';
import { authMiddleware } from '../middlewares/authMiddleware';
import { validateRequest } from '../middlewares/validateRequest';
import Joi from 'joi';

const router = Router();

// All transaction routes require authentication
router.use(authMiddleware);

// Validation schemas
const createTransactionSchema = Joi.object({
  type: Joi.string().valid('deposit', 'withdraw', 'reward', 'swap', 'compound').required(),
  platform: Joi.string().required(),
  token: Joi.string().required(),
  amount: Joi.number().positive().required(),
  value: Joi.number().positive().required(),
  txHash: Joi.string().optional(),
  fromAddress: Joi.string().optional(),
  toAddress: Joi.string().optional(),
  metadata: Joi.object({
    strategyId: Joi.string().optional(),
    portfolioId: Joi.string().optional(),
    notes: Joi.string().max(500).optional(),
    pricePerToken: Joi.number().positive().optional()
  }).optional()
});

const updateTransactionSchema = Joi.object({
  status: Joi.string().valid('pending', 'completed', 'failed', 'cancelled').optional(),
  txHash: Joi.string().optional(),
  gasUsed: Joi.number().min(0).optional(),
  gasFee: Joi.number().min(0).optional(),
  blockNumber: Joi.number().min(0).optional(),
  metadata: Joi.object({
    notes: Joi.string().max(500).optional()
  }).optional()
});

// CRUD operations
router.get('/', transactionController.getUserTransactions.bind(transactionController));
router.get('/stats', transactionController.getTransactionStats.bind(transactionController));
router.get('/:id', transactionController.getTransactionById.bind(transactionController));

router.post('/',
  validateRequest(createTransactionSchema),
  transactionController.createTransaction.bind(transactionController)
);

router.put('/:id',
  validateRequest(updateTransactionSchema),
  transactionController.updateTransaction.bind(transactionController)
);

router.delete('/:id', transactionController.deleteTransaction.bind(transactionController));

export default router;
