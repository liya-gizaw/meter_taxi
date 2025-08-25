import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.js';
import { documentController, documentValidations, upload } from '../controllers/documentController.js';
import { requirePermission } from '../middleware/permissions.js';

const router = Router();

    router.post(
    '/upload',
    authMiddleware(['admin','driver','passenger']),
    requirePermission('documents.upload'),
    upload.single('file'),
    documentValidations.upload,
    documentController.upload
    );  
router.get('/me', authMiddleware(['driver','passenger']), documentController.listMine);

router.put('/:id/review', authMiddleware(['admin']), requirePermission('admin.documents.review'), documentValidations.review, documentController.review);

export default router;
