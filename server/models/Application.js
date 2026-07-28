import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema(
    {
        jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
        candidateId: { type: mongoose.Schema.Types.ObjectId, ref: 'Candidate', required: true },
        status: {
            type: String,
            enum: ['Applied', 'Under Review', 'Shortlisted', 'Interview Scheduled', 'Selected', 'Rejected'],
            default: 'Applied',
        },
    },
    { timestamps: true }
);
applicationSchema.index({ jobId: 1, candidateId: 1 }, { unique: true });

export default mongoose.model('Application', applicationSchema);