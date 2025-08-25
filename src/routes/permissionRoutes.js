import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.js';
import { requirePermission } from '../middleware/permissions.js';
import { permissionController, permissionValidations } from '../controllers/permissionController.js';

const router = Router();

router.post('/', authMiddleware(['admin']), requirePermission('permissions.create'), permissionValidations.create, permissionController.create);
router.get('/', authMiddleware(['admin']), requirePermission('permissions.list'), permissionController.list);
router.post('/:role/grant', authMiddleware(['admin']), requirePermission('permissions.grant'), permissionValidations.grant, permissionController.grant);
router.post('/:role/revoke', authMiddleware(['admin']), requirePermission('permissions.revoke'), permissionValidations.revoke, permissionController.revoke);
router.get('/:role', authMiddleware(['admin']), requirePermission('permissions.listRole'), permissionController.listRole);

export default router;
