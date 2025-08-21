import { Router } from 'express';
import { body } from 'express-validator';
import { authMiddleware } from '../middleware/auth.js';
import { profileController } from '../controllers/profileController.js';

const router = Router();

router.get('/me', authMiddleware(), profileController.me);

router.put(
  '/',
  authMiddleware(),
  [
    body('first_name').optional().isString().isLength({ max: 50 }),
    body('last_name').optional().isString().isLength({ max: 50 }),
    body('gender').optional().isIn(['male', 'female']),
    body('dob').optional().isISO8601(),
  ],
  profileController.update
);

export default router;

