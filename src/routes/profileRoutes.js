import { Router } from 'express';
import { body } from 'express-validator';
import { authMiddleware } from '../middleware/auth.js';
import { profileController, profileValidations } from '../controllers/profileController.js';
import { requirePermission } from '../middleware/permissions.js';

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

// Admin endpoints (moved from /admin/profiles)
router.get('/', authMiddleware(['admin']), requirePermission('admin.profiles.list'), profileValidations.list, profileController.list);
router.get('/:id', authMiddleware(['admin']), requirePermission('admin.profiles.get'), profileValidations.get, profileController.get);
router.post('/', authMiddleware(['admin']), requirePermission('admin.profiles.create'), profileValidations.create, profileController.create);
router.put('/:id', authMiddleware(['admin']), requirePermission('admin.profiles.update'), profileValidations.update, profileController.adminUpdate);
router.delete('/:id', authMiddleware(['admin']), requirePermission('admin.profiles.delete'), profileValidations.remove, profileController.remove);

export default router;

