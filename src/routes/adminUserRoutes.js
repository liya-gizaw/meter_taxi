import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.js';
import { adminUserController, adminUserValidations } from '../controllers/adminUserController.js';
import { requirePermission } from '../middleware/permissions.js';

const router = Router();

router.get('/', authMiddleware(['admin']), requirePermission('admin.users.list'), adminUserValidations.list, adminUserController.list);
router.get('/:id', authMiddleware(['admin']), requirePermission('admin.users.get'), adminUserValidations.get, adminUserController.get);
router.post('/', authMiddleware(['admin']), requirePermission('admin.users.create'), adminUserValidations.create, adminUserController.create);
router.put('/:id', authMiddleware(['admin']), requirePermission('admin.users.update'), adminUserValidations.update, adminUserController.update);
router.delete('/:id', authMiddleware(['admin']), requirePermission('admin.users.delete'), adminUserValidations.remove, adminUserController.remove);

export default router;