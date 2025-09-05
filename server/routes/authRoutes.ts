import { Router } from 'express';
import { authController } from '../controllers/authController';
import { authMiddleware } from '../middlewares/authMiddleware';
import { validateRequest } from '../middlewares/validateRequest';
import { rateLimitMiddleware } from '../middlewares/validateRequest';
import Joi from 'joi';

const router = Router();

// Validation schemas
const registerSchema = Joi.object({
  name: Joi.string().min(2).max(50).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required()
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

const forgotPasswordSchema = Joi.object({
  email: Joi.string().email().required()
});

const resetPasswordSchema = Joi.object({
  token: Joi.string().required(),
  newPassword: Joi.string().min(6).required()
});

// Public routes with rate limiting
router.post('/register', 
  rateLimitMiddleware,
  validateRequest(registerSchema),
  authController.register.bind(authController)
);

router.post('/login',
  rateLimitMiddleware,
  validateRequest(loginSchema),
  authController.login.bind(authController)
);

router.post('/forgot-password',
  rateLimitMiddleware,
  validateRequest(forgotPasswordSchema),
  authController.forgotPassword.bind(authController)
);

router.post('/reset-password',
  rateLimitMiddleware,
  validateRequest(resetPasswordSchema),
  authController.resetPassword.bind(authController)
);

router.post('/verify-email/:token',
  authController.verifyEmail.bind(authController)
);

// Protected routes
router.get('/me',
  authMiddleware,
  authController.getMe.bind(authController)
);

router.post('/refresh-token',
  authMiddleware,
  authController.refreshToken.bind(authController)
);

router.post('/logout',
  authMiddleware,
  authController.logout.bind(authController)
);

router.post('/change-password',
  authMiddleware,
  validateRequest(Joi.object({
    currentPassword: Joi.string().required(),
    newPassword: Joi.string().min(6).required()
  })),
  authController.changePassword.bind(authController)
);

export default router;
