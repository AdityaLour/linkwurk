import express from 'express';
import { requireAuth, requireRole } from '../middlewares/authMiddleware.js';
import {
    applyToJob,
    getMyApplications,
    getApplicantsForJob,
    updateApplicationStatus,
} from '../controllers/applicationController.js';

const router = express.Router();

router.post('/', requireAuth, requireRole('candidate'), applyToJob);
router.get('/mine', requireAuth, requireRole('candidate'), getMyApplications);
router.get('/job/:jobId', requireAuth, requireRole('recruiter'), getApplicantsForJob);
router.patch('/:id/status', requireAuth, requireRole('recruiter'), updateApplicationStatus);

export default router;