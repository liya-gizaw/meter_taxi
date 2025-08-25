import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.js';
import { adminProfileController, adminProfileValidations } from '../controllers/adminProfileController.js';
import { requirePermission } from '../middleware/permissions.js';

const router = Router();

router.get('/', authMiddleware(['admin']), requirePermission('admin.profiles.list'), adminProfileValidations.list, adminProfileController.list);
router.get('/:id', authMiddleware(['admin']), requirePermission('admin.profiles.get'), adminProfileValidations.get, adminProfileController.get);
router.post('/', authMiddleware(['admin']), requirePermission('admin.profiles.create'), adminProfileValidations.create, adminProfileController.create);
router.put('/:id', authMiddleware(['admin']), requirePermission('admin.profiles.update'), adminProfileValidations.update, adminProfileController.update);
router.delete('/:id', authMiddleware(['admin']), requirePermission('admin.profiles.delete'), adminProfileValidations.remove, adminProfileController.remove);

export default router;