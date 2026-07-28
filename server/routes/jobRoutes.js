import express from 'express';
import { requireAuth, requireRole } from '../middlewares/authMiddleware.js';
import { createJob, updateJob, updateJobStatus, getMyJobs, deleteJob } from '../controllers/jobController.js';


const router = express.Router();

router.post('/', requireAuth, requireRole('recruiter'), createJob);
router.get('/mine', requireAuth, requireRole('recruiter'), getMyJobs);
router.put('/:id', requireAuth, requireRole('recruiter'), updateJob);
router.delete('/:id', requireAuth, requireRole('recruiter'), deleteJob);
router.patch('/:id/status', requireAuth, requireRole('recruiter'), updateJobStatus);

export default router;