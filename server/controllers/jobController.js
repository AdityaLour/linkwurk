import Job from '../models/Job.js';
import Recruiter from '../models/Recruiter.js';

export const createJob = async (req, res) => {
    try {
        const recruiter = await Recruiter.findOne({ userId: req.session.userId });

        if (!recruiter.companyName || !recruiter.numberOfEmployees) {
            return res.status(400).json({
                message: 'Please complete your company profile before posting a job',
            });
        }

        const { title, location, salaryMin, salaryMax, skillsRequired, experienceRequired, description } = req.body;

        if (!title || !location || !description) {
            return res.status(400).json({ message: 'Title, location, and description are required' });
        }

        const job = await Job.create({
            recruiterId: recruiter._id,
            title,
            location,
            salaryMin,
            salaryMax,
            skillsRequired,
            experienceRequired,
            description,
        });

        res.status(201).json({ job });
    } catch (err) {
        res.status(500).json({ message: 'Failed to create job', error: err.message });
    }
};