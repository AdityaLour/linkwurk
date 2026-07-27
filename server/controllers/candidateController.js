import Candidate from '../models/Candidate.js';
import { uploadToImageKit } from '../lib/imageUpload.js';

export const getMyCandidateProfile = async (req, res) => {
    try {
        const candidate = await Candidate.findOne({ userId: req.session.userId });
        if (!candidate) return res.status(404).json({ message: 'Candidate profile not found' });
        res.status(200).json({ candidate });
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch profile', error: err.message });
    }
};

export const updateMyCandidateProfile = async (req, res) => {
    try {
        const candidate = await Candidate.findOne({ userId: req.session.userId });
        if (!candidate) return res.status(404).json({ message: 'Candidate profile not found' });

        const { summary, skills, education } = req.body;

        if (summary !== undefined) candidate.summary = summary;
        if (skills !== undefined) candidate.skills = JSON.parse(skills);
        if (education !== undefined) candidate.education = JSON.parse(education);

        if (req.files?.profilePicture) {
            candidate.profilePicture = await uploadToImageKit(req.files.profilePicture[0], 'candidates/profile-pictures');
        }
        if (req.files?.resume) {
            const url = await uploadToImageKit(req.files.resume[0], 'candidates/resumes');
            candidate.resume = {
                url,
                fileName: req.files.resume[0].originalname,
                uploadedAt: new Date(),
            };
        }
        if (req.files?.certifications) {
            const uploadedUrls = await Promise.all(
                req.files.certifications.map((file) => uploadToImageKit(file, 'candidates/certifications'))
            );
            candidate.certifications.push(...uploadedUrls);
        }

        await candidate.save();
        res.status(200).json({ candidate });
    } catch (err) {
        res.status(500).json({ message: 'Failed to update profile', error: err.message });
    }
};  