import { Router } from 'express';
import { body } from 'express-validator';
import { authMiddleware } from '../middleware/auth.js';
import { requirePermission } from '../middleware/permissions.js';
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

// Self CRUD endpoints
router.get('/me', authMiddleware(), authController.me);
router.put(
  '/me',
  authMiddleware(),
  [
    body('email').optional().isEmail(),
    body('phone').optional().isString().isLength({ min: 3, max: 20 }),
    body('password').optional().isLength({ min: 6 })
  ],
  authController.updateMe
);
router.delete('/me', authMiddleware(), authController.deleteMe);

// Admin: list all users and get user by id
router.get('/users', authMiddleware(['admin']), requirePermission('admin.auth.users.list'), authController.listUsers);
router.get('/users/:id', authMiddleware(['admin']), requirePermission('admin.auth.users.get'), authController.getUserById);

export default router;
