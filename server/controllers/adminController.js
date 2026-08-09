import User from '../models/User.js';
import Recruiter from '../models/Recruiter.js';
import Job from '../models/Job.js';
import Application from '../models/Application.js';

export const getPlatformStats = async (req, res) => {
    try {
        const [totalCandidates, totalRecruiters, totalJobs, activeJobs, totalApplications] = await Promise.all([
            User.countDocuments({ role: 'candidate' }),
            User.countDocuments({ role: 'recruiter' }),
            Job.countDocuments(),
            Job.countDocuments({ status: 'open' }),
            Application.countDocuments(),
        ]);
        res.status(200).json({ totalCandidates, totalRecruiters, totalJobs, activeJobs, totalApplications });
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch platform stats', error: err.message });
    }
};

export const getAllUsers = async (req, res) => {
    try {
        const filter = {};
        if (req.query.role) filter.role = req.query.role;
        const users = await User.find(filter).select('-passwordHash').sort({ createdAt: -1 });
        res.status(200).json({ users });
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch users', error: err.message });
    }
};

export const toggleUserStatus = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        if (user.role === 'admin') {
            return res.status(403).json({ message: 'Cannot deactivate an admin account' });
        }
        user.isActive = !user.isActive;
        await user.save();
        res.status(200).json({ user: { _id: user._id, isActive: user.isActive } });
    } catch (err) {
        res.status(500).json({ message: 'Failed to update user status', error: err.message });
    }
};

export const getAllRecruitersWithStats = async (req, res) => {
    try {
        const recruiters = await Recruiter.find().populate('userId', 'firstName lastName email isActive createdAt');
        const recruiterIds = recruiters.map((r) => r._id);

        const jobCounts = await Job.aggregate([
            { $match: { recruiterId: { $in: recruiterIds } } },
            { $group: { _id: '$recruiterId', count: { $sum: 1 } } },
        ]);
        const countMap = {};
        jobCounts.forEach((jc) => { countMap[jc._id.toString()] = jc.count; });

        const result = recruiters.map((r) => ({
            _id: r._id,
            userId: r.userId,
            companyName: r.companyName,
            companyLogo: r.companyLogo,
            numberOfEmployees: r.numberOfEmployees,
            jobCount: countMap[r._id.toString()] || 0,
        }));

        res.status(200).json({ recruiters: result });
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch recruiters', error: err.message });
    }
};