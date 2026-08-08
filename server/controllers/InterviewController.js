import Interview from '../models/Interview.js';
import Application from '../models/Application.js';
import Candidate from '../models/Candidate.js';
import Recruiter from '../models/Recruiter.js';

export const scheduleInterview = async (req, res) => {
    try {
        const recruiter = await Recruiter.findOne({ userId: req.session.userId });
        const { applicationId, scheduledAt, notes } = req.body;

        const application = await Application.findById(applicationId).populate('jobId');
        if (!application) return res.status(404).json({ message: 'Application not found' });
        if (application.jobId.recruiterId.toString() !== recruiter._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to schedule an interview for this application' });
        }
        if (application.status !== 'Shortlisted') {
            return res.status(400).json({ message: 'Only shortlisted applications can be scheduled for interview' });
        }

        const interview = await Interview.create({ applicationId, scheduledAt, notes });

        application.status = 'Interview Scheduled';
        await application.save();

        res.status(201).json({ interview, application });
    } catch (err) {
        res.status(500).json({ message: 'Failed to schedule interview', error: err.message });
    }
};

export const updateInterview = async (req, res) => {
    try {
        const recruiter = await Recruiter.findOne({ userId: req.session.userId });
        const interview = await Interview.findById(req.params.id).populate({
            path: 'applicationId',
            populate: { path: 'jobId' },
        });

        if (!interview) return res.status(404).json({ message: 'Interview not found' });
        if (interview.applicationId.jobId.recruiterId.toString() !== recruiter._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to update this interview' });
        }

        const { scheduledAt, status, notes } = req.body;
        if (scheduledAt !== undefined) interview.scheduledAt = scheduledAt;
        if (status !== undefined) interview.status = status;
        if (notes !== undefined) interview.notes = notes;

        await interview.save();

        if (status === 'Passed') {
            interview.applicationId.status = 'Selected';
            await interview.applicationId.save();
        } else if (status === 'Failed') {
            interview.applicationId.status = 'Rejected';
            await interview.applicationId.save();
        }

        res.status(200).json({ interview });
    } catch (err) {
        res.status(500).json({ message: 'Failed to update interview', error: err.message });
    }
};

export const getMyInterviews = async (req, res) => {
    try {
        const recruiter = await Recruiter.findOne({ userId: req.session.userId });

        const interviews = await Interview.find()
            .populate({
                path: 'applicationId',
                populate: [
                    { path: 'jobId', select: 'title recruiterId' },
                    { path: 'candidateId', populate: { path: 'userId', select: 'firstName lastName email' } },
                ],
            })
            .sort({ scheduledAt: 1 });

        const mine = interviews.filter(
            (i) => i.applicationId?.jobId?.recruiterId?.toString() === recruiter._id.toString()
        );

        res.status(200).json({ interviews: mine });
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch interviews', error: err.message });
    }
};

export const getMyInterviewsAsCandidate = async (req, res) => {
    try {
        const candidate = await Candidate.findOne({ userId: req.session.userId });
        const applications = await Application.find({ candidateId: candidate._id }).select('_id');
        const applicationIds = applications.map((a) => a._id);

        const interviews = await Interview.find({ applicationId: { $in: applicationIds } })
            .populate({
                path: 'applicationId',
                populate: {
                    path: 'jobId',
                    select: 'title recruiterId',
                    populate: { path: 'recruiterId', select: 'companyName' },
                },
            }).sort({ scheduledAt: 1 });

        res.status(200).json({ interviews });
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch interviews', error: err.message });
    }
};