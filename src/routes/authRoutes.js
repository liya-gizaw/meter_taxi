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
  ],
  authController.register
);

router.post(
  '/login',
  [body('email').isEmail(), body('password').isLength({ min: 6 })],
  authController.login
);

router.post(
  '/register-phone',
  [
    body('phone').isString().isLength({ min: 3, max: 20 }),
    body('password').optional().isLength({ min: 6 }),
    body('role').optional().isIn(['passenger', 'driver', 'dispatcher', 'admin', 'finance']),
  ],
  authController.registerPhone
);

router.post(
  '/login-phone',
  [body('phone').isString().isLength({ min: 3, max: 20 }), body('password').isLength({ min: 6 })],
  authController.loginPhone
);

router.post(
  '/social',
  [
    body('provider').isIn(['google','facebook','apple']).withMessage('Invalid provider'),
    body('email').optional().isEmail(),
    body('phone').optional().isString(),
    body('externalId').optional().isString(),
  ],
  authController.socialLogin
);

export default router;
