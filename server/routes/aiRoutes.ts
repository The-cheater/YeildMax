import { Router } from 'express';
import { aiController } from '../controllers/aiController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();

router.use(authMiddleware);
router.post('/recommendations', aiController.getRecommendations.bind(aiController));
router.post('/optimize', aiController.optimizeStrategy.bind(aiController));

export default router;
