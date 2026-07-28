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

        const { title, location, salaryMin, salaryMax, skillsRequired, experienceRequired, description, numberOfOpenings,
            lastApplyDate, applicationType, externalApplyUrl } = req.body;

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
            numberOfOpenings,
            lastApplyDate,
            applicationType,
            externalApplyUrl,
        });

        res.status(201).json({ job });
    } catch (err) {
        res.status(500).json({ message: 'Failed to create job', error: err.message });
    }
};

export const getMyJobs = async (req, res) => {
    try {
        const recruiter = await Recruiter.findOne({ userId: req.session.userId });
        const jobs = await Job.find({ recruiterId: recruiter._id }).sort({ createdAt: -1 });
        res.status(200).json({ jobs });
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch jobs', error: err.message });
    }
};

export const updateJob = async (req, res) => {
    try {
        const recruiter = await Recruiter.findOne({ userId: req.session.userId });
        const job = await Job.findById(req.params.id);

        if (!job) return res.status(404).json({ message: 'Job not found' });
        if (job.recruiterId.toString() !== recruiter._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to edit this job' });
        }

        const { title, location, salaryMin, salaryMax, skillsRequired, experienceRequired, description } = req.body;
        if (title !== undefined) job.title = title;
        if (location !== undefined) job.location = location;
        if (salaryMin !== undefined) job.salaryMin = salaryMin;
        if (salaryMax !== undefined) job.salaryMax = salaryMax;
        if (skillsRequired !== undefined) job.skillsRequired = skillsRequired;
        if (experienceRequired !== undefined) job.experienceRequired = experienceRequired;
        if (description !== undefined) job.description = description;
        if (numberOfOpenings !== undefined) job.numberOfOpenings = numberOfOpenings;
        if (lastApplyDate !== undefined) job.lastApplyDate = lastApplyDate;
        if (applicationType !== undefined) job.applicationType = applicationType;
        if (externalApplyUrl !== undefined) job.externalApplyUrl = externalApplyUrl;

        if (job.applicationType === 'external' && !job.externalApplyUrl) {
            return res.status(400).json({ message: 'External applications require an application URL' });
        }

        await job.save();
        res.status(200).json({ job });
    } catch (err) {
        res.status(500).json({ message: 'Failed to update job', error: err.message });
    }
};

export const deleteJob = async (req, res) => {
    try {
        const recruiter = await Recruiter.findOne({ userId: req.session.userId });
        const job = await Job.findById(req.params.id);

        if (!job) return res.status(404).json({ message: 'Job not found' });
        if (job.recruiterId.toString() !== recruiter._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to delete this job' });
        }

        await job.deleteOne();
        res.status(200).json({ message: 'Job deleted' });
    } catch (err) {
        res.status(500).json({ message: 'Failed to delete job', error: err.message });
    }
};

export const updateJobStatus = async (req, res) => {
    try {
        const recruiter = await Recruiter.findOne({ userId: req.session.userId });
        const job = await Job.findById(req.params.id);

        if (!job) return res.status(404).json({ message: 'Job not found' });
        if (job.recruiterId.toString() !== recruiter._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to update this job' });
        }

        job.status = job.status === 'open' ? 'closed' : 'open';
        await job.save();
        res.status(200).json({ job });
    } catch (err) {
        res.status(500).json({ message: 'Failed to update job status', error: err.message });
    }
};

export const getAllJobs = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const filter = { status: 'open' };

        const [jobs, total] = await Promise.all([
            Job.find(filter)
                .populate('recruiterId', 'companyName companyLogo')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit),
            Job.countDocuments(filter),
        ]);

        res.status(200).json({
            jobs,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(total / limit),
                totalJobs: total,
            },
        });
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch jobs', error: err.message });
    }
};

export const getJobById = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id).populate('recruiterId', 'companyName companyLogo website companyTagline address');
        if (!job) return res.status(404).json({ message: 'Job not found' });
        res.status(200).json({ job });
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch job', error: err.message });
    }
};