import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.js';
import { userController, userValidations } from '../controllers/userController.js';

const router = Router();

router.put('/me/availability', authMiddleware(['driver','dispatcher','admin','finance','passenger']), userValidations.availability, userController.setAvailability);

export default router;
