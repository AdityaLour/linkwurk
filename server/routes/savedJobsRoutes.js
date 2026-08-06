import express from 'express';
import { requireAuth, requireRole } from '../middlewares/authMiddleware.js';
import { toggleSaveJob, getSavedJobs } from '../controllers/savedJobController.js';

const router = express.Router();

router.post('/toggle', requireAuth, requireRole('candidate'), toggleSaveJob);
router.get('/mine', requireAuth, requireRole('candidate'), getSavedJobs);

export default router;