import { Router } from 'express';
import authRoutes from './authRoutes.js';
import profileRoutes from './profileRoutes.js';
import permissionRoutes from './permissionRoutes.js';
import adminUserRoutes from './adminUserRoutes.js';
import adminProfileRoutes from './adminProfileRoutes.js';
import userRoutes from './userRoutes.js';
import documentRoutes from './documentRoutes.js';
import ratingRoutes from './ratingRoutes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/profiles', profileRoutes);
router.use('/permissions', permissionRoutes);
router.use('/admin/users', adminUserRoutes);
router.use('/admin/profiles', adminProfileRoutes);
router.use('/users', userRoutes);
router.use('/documents', documentRoutes);
router.use('/ratings', ratingRoutes);

export default router;
