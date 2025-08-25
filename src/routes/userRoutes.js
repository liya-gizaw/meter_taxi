import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.js';
import { userController, userValidations } from '../controllers/userController.js';
import { requirePermission } from '../middleware/permissions.js';

const router = Router();

router.put('/me/availability', authMiddleware(['driver','dispatcher','admin','finance','passenger']), userValidations.availability, userController.setAvailability);

// Admin endpoints (moved from /admin/users)
router.get('/', authMiddleware(['admin']), requirePermission('admin.users.list'), userValidations.list, userController.list);
router.get('/:id', authMiddleware(['admin']), requirePermission('admin.users.get'), userValidations.get, userController.get);
router.post('/', authMiddleware(['admin']), requirePermission('admin.users.create'), userValidations.create, userController.create);
router.put('/:id', authMiddleware(['admin']), requirePermission('admin.users.update'), userValidations.update, userController.update);
router.delete('/:id', authMiddleware(['admin']), requirePermission('admin.users.delete'), userValidations.remove, userController.remove);

export default router;
