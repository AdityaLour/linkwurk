import express from 'express';
import { requireAuth, requireRole } from '../middlewares/authMiddleware.js';
import { createJob } from '../controllers/jobController.js';

const router = express.Router();

router.post('/', requireAuth, requireRole('recruiter'), createJob);

export default router;