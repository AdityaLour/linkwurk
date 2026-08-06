import mongoose from 'mongoose';

const savedJobSchema = new mongoose.Schema(
    {
        candidateId: { type: mongoose.Schema.Types.ObjectId, ref: 'Candidate', required: true },
        jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
    },
    { timestamps: true }
);

savedJobSchema.index({ candidateId: 1, jobId: 1 }, { unique: true });

export default mongoose.model('SavedJob', savedJobSchema);