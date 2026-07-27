import express from 'express';
import { requireAuth, requireRole } from '../middlewares/authMiddleware.js';
import upload from '../middlewares/upload.js';
import { getMyCandidateProfile, updateMyCandidateProfile } from '../controllers/candidateController.js';

const router = express.Router();

router.get('/me', requireAuth, requireRole('candidate'), getMyCandidateProfile);
router.put(
    '/me',
    requireAuth,
    requireRole('candidate'),
    upload.fields([
        { name: 'profilePicture', maxCount: 1 },
        { name: 'resume', maxCount: 1 },
        { name: 'certifications', maxCount: 5 },
    ]),
    updateMyCandidateProfile
);

export default router;