import { Router } from 'express';
import { userController } from '../controllers/userController';
import { authMiddleware, adminMiddleware, resourceOwnerMiddleware } from '../middlewares/authMiddleware';

const router = Router();

// Public routes (no auth required)
// ... public routes

// Protected routes (require authentication)
router.use(authMiddleware); // Apply to all routes below

router.get('/profile', userController.getProfile.bind(userController));
router.put('/profile', userController.updateProfile.bind(userController));

// Resource owner protection
router.get('/:id', resourceOwnerMiddleware(), userController.getUserById.bind(userController));
router.put('/:id', resourceOwnerMiddleware(), userController.updateUser.bind(userController));
router.delete('/:id', resourceOwnerMiddleware(), userController.deleteUser.bind(userController));

// Admin-only routes
router.get('/admin/all', adminMiddleware, userController.getAllUsers.bind(userController));

export default router;
