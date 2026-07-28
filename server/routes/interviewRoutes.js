import express from 'express';
import { requireAuth, requireRole } from '../middlewares/authMiddleware.js';
import {
    scheduleInterview,
    updateInterview,
    getMyInterviews,
    getMyInterviewsAsCandidate,
} from '../controllers/interviewController.js';

const router = express.Router();

router.post('/', requireAuth, requireRole('recruiter'), scheduleInterview);
router.put('/:id', requireAuth, requireRole('recruiter'), updateInterview);
router.get('/mine', requireAuth, requireRole('recruiter'), getMyInterviews);
router.get('/mine/candidate', requireAuth, requireRole('candidate'), getMyInterviewsAsCandidate);

export default router;