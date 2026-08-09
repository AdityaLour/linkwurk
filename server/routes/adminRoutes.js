import express from 'express';
import { getPlatformStats, getAllUsers, toggleUserStatus, verifyUserEmail, getAllRecruitersWithStats } from '../controllers/adminController.js';
import { requireAuth, requireRole } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.use(requireAuth, requireRole('admin'));

router.get('/stats', getPlatformStats);
router.get('/users', getAllUsers);
router.patch('/users/:id/toggle-status', toggleUserStatus);
router.patch('/users/:id/verify-email', verifyUserEmail);
router.get('/recruiters', getAllRecruitersWithStats);

export default router;