import { Router } from 'express';
import { yieldController } from '../controllers/yieldController';
import { authMiddleware } from '../middlewares/authMiddleware';
import { rateLimitMiddleware } from '../middlewares/validateRequest';

const router = Router();

// Public routes
router.get('/', rateLimitMiddleware, yieldController.getAllYields.bind(yieldController));
router.get('/top/:limit?', rateLimitMiddleware, yieldController.getTopYields.bind(yieldController));
router.get('/:id', rateLimitMiddleware, yieldController.getYieldById.bind(yieldController));

// Protected routes (require authentication)
// Add protected routes here if needed

export default router;
