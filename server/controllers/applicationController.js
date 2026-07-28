import Application from '../models/Application.js';
import Candidate from '../models/Candidate.js';
import Recruiter from '../models/Recruiter.js';
import Job from '../models/Job.js';

const VALID_TRANSITIONS = {
    Applied: ['Under Review', 'Rejected'],
    'Under Review': ['Shortlisted', 'Rejected'],
    Shortlisted: ['Interview Scheduled', 'Rejected'],
    'Interview Scheduled': ['Selected', 'Rejected'],
    Selected: [],
    Rejected: [],
};

export const applyToJob = async (req, res) => {
    try {
        const candidate = await Candidate.findOne({ userId: req.session.userId });
        const { jobId } = req.body;

        const job = await Job.findById(jobId);
        if (!job) return res.status(404).json({ message: 'Job not found' });

        if (job.applicationType !== 'internal') {
            return res.status(400).json({ message: 'This job accepts applications externally' });
        }
        if (job.status !== 'open') {
            return res.status(400).json({ message: 'This job is no longer accepting applications' });
        }
        if (job.lastApplyDate && new Date() > new Date(job.lastApplyDate)) {
            return res.status(400).json({ message: 'The application deadline for this job has passed' });
        }

        const application = await Application.create({ jobId, candidateId: candidate._id });
        res.status(201).json({ application });
    } catch (err) {
        if (err.code === 11000) {
            return res.status(400).json({ message: 'You have already applied to this job' });
        }
        res.status(500).json({ message: 'Failed to apply', error: err.message });
    }
};

export const getMyApplications = async (req, res) => {
    try {
        const candidate = await Candidate.findOne({ userId: req.session.userId });
        const applications = await Application.find({ candidateId: candidate._id })
            .populate({
                path: 'jobId',
                select: 'title location salaryMin salaryMax status',
                populate: { path: 'recruiterId', select: 'companyName companyLogo' },
            })
            .sort({ createdAt: -1 });

        res.status(200).json({ applications });
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch applications', error: err.message });
    }
};


export const getApplicantsForJob = async (req, res) => {
    try {
        const recruiter = await Recruiter.findOne({ userId: req.session.userId });
        const job = await Job.findById(req.params.jobId);

        if (!job) return res.status(404).json({ message: 'Job not found' });
        if (job.recruiterId.toString() !== recruiter._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to view applicants for this job' });
        }

        const applications = await Application.find({ jobId: req.params.jobId })
            .populate({
                path: 'candidateId',
                select: 'profilePicture resume summary skills education',
                populate: { path: 'userId', select: 'firstName lastName email' },
            })
            .sort({ createdAt: -1 });

        res.status(200).json({ applications });
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch applicants', error: err.message });
    }
};

export const updateApplicationStatus = async (req, res) => {
    try {
        const recruiter = await Recruiter.findOne({ userId: req.session.userId });
        const application = await Application.findById(req.params.id).populate('jobId');

        if (!application) return res.status(404).json({ message: 'Application not found' });
        if (application.jobId.recruiterId.toString() !== recruiter._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to update this application' });
        }

        const { status } = req.body;
        const allowedNext = VALID_TRANSITIONS[application.status] || [];

        if (!allowedNext.includes(status)) {
            return res.status(400).json({
                message: `Cannot move application from "${application.status}" to "${status}"`,
            });
        }

        application.status = status;
        await application.save();
        res.status(200).json({ application });
    } catch (err) {
        res.status(500).json({ message: 'Failed to update application status', error: err.message });
    }
};