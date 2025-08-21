import { Router } from 'express';
import { body } from 'express-validator';
import { authController } from '../controllers/authController.js';

const router = Router();

router.post(
  '/register',
  [
    body('email').isEmail().withMessage('Valid email required'),
    body('password').optional().isLength({ min: 6 }).withMessage('Min 6 chars'),
    body('role').optional().isIn(['passenger', 'driver', 'dispatcher', 'admin', 'finance']),
    body('language').optional().isIn(['am', 'en', 'om', 'ti', 'af']),
  ],
  authController.register
);

router.post(
  '/login',
  [body('email').isEmail(), body('password').isLength({ min: 6 })],
  authController.login
);

export default router;

