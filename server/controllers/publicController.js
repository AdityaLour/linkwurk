import User from '../models/User.js';
import Job from '../models/Job.js';

export const getPublicStats = async (req, res) => {
    try {
        const [candidates, recruiters, jobsPosted] = await Promise.all([
            User.countDocuments({ role: 'candidate' }),
            User.countDocuments({ role: 'recruiter' }),
            Job.countDocuments(),
        ]);
        res.status(200).json({ candidates, recruiters, jobsPosted });
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch stats', error: err.message });
    }
};