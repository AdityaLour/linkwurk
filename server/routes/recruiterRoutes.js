import express from 'express';
import { requireAuth, requireRole } from '../middlewares/authMiddleware.js';
import upload from '../middlewares/upload.js';
import { getRecruiterProfile, updateRecruiterProfile } from '../controllers/recruiterController.js';

const router = express.Router();

router.get('/me', requireAuth, requireRole('recruiter'), getRecruiterProfile);
router.put(
    '/me',
    requireAuth,
    requireRole('recruiter'),
    upload.fields([{ name: 'profilePicture', maxCount: 1 }, { name: 'companyLogo', maxCount: 1 }]),
    updateRecruiterProfile
);

export default router;