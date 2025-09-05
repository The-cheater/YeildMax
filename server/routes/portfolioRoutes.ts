import { Router } from 'express';
import { portfolioController } from '../controllers/portfolioController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();

// All portfolio routes require authentication
router.use(authMiddleware);

router.get('/', portfolioController.getUserPortfolio.bind(portfolioController));
router.post('/positions', portfolioController.addPosition.bind(portfolioController));
router.put('/positions/:positionId', portfolioController.updatePosition.bind(portfolioController));

export default router;
