import { Router } from 'express';
import authRoutes from './authRoutes.js';
import profileRoutes from './profileRoutes.js';
import permissionRoutes from './permissionRoutes.js';
// admin routes merged into userRoutes and profileRoutes
import userRoutes from './userRoutes.js';
import documentRoutes from './documentRoutes.js';
import ratingRoutes from './ratingRoutes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/profiles', profileRoutes);
router.use('/permissions', permissionRoutes);
// merged: admin endpoints live under /users and /profiles with admin middleware
router.use('/users', userRoutes);
router.use('/documents', documentRoutes);
router.use('/ratings', ratingRoutes);

export default router;
