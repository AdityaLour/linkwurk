import mongoose from 'mongoose';

const interviewSchema = new mongoose.Schema(
    {
        applicationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Application', required: true },
        scheduledAt: { type: Date, required: true },
        status: {
            type: String,
            enum: ['Scheduled', 'Completed', 'Passed', 'Failed'],
            default: 'Scheduled',
        },
        notes: { type: String, trim: true, default: '' },
    },
    { timestamps: true }
);

export default mongoose.model('Interview', interviewSchema);