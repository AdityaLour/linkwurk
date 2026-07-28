import express from 'express';
import { requireAuth, requireRole } from '../middlewares/authMiddleware.js';
import { createJob, updateJob, updateJobStatus, getMyJobs, deleteJob, getAllJobs } from '../controllers/jobController.js';


const router = express.Router();

router.post('/', requireAuth, requireRole('recruiter'), createJob);
router.get('/mine', requireAuth, requireRole('recruiter'), getMyJobs);
router.put('/:id', requireAuth, requireRole('recruiter'), updateJob);
router.delete('/:id', requireAuth, requireRole('recruiter'), deleteJob);
router.patch('/:id/status', requireAuth, requireRole('recruiter'), updateJobStatus);
router.get('/', getAllJobs);

export default router;