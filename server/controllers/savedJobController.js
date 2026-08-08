import SavedJob from '../models/SavedJob.js';
import Candidate from '../models/Candidate.js';

export const toggleSaveJob = async (req, res) => {
    try {
        const candidate = await Candidate.findOne({ userId: req.session.userId });
        const { jobId } = req.body;

        const existing = await SavedJob.findOne({ candidateId: candidate._id, jobId });
        if (existing) {
            await existing.deleteOne();
            return res.status(200).json({ saved: false, message: 'Job removed from saved list' });
        }

        await SavedJob.create({ candidateId: candidate._id, jobId });
        res.status(201).json({ saved: true, message: 'Job saved' });
    } catch (err) {
        res.status(500).json({ message: 'Failed to update saved job', error: err.message });
    }
};

export const getSavedJobs = async (req, res) => {
    try {
        const candidate = await Candidate.findOne({ userId: req.session.userId });

        const saved = await SavedJob.find({ candidateId: candidate._id })
            .populate({
                path: 'jobId',
                select: 'title location salaryMin salaryMax status skillsRequired',
                populate: { path: 'recruiterId', select: 'companyName companyLogo' },
            })
            .sort({ createdAt: -1 });

        res.status(200).json({ savedJobs: saved });
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch saved jobs', error: err.message });
    }
};