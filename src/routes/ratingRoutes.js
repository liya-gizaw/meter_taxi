import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.js';
import { ratingController, ratingValidations } from '../controllers/ratingController.js';

const router = Router();

router.post('/', authMiddleware(['driver','passenger']), ratingValidations.create, ratingController.create);
router.get('/user/:userId', authMiddleware(['driver','passenger','dispatcher','admin','finance']), ratingValidations.listForUser, ratingController.listForUser);

export default router;
