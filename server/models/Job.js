import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema(
    {
        recruiterId: { type: mongoose.Schema.Types.ObjectId, ref: 'Recruiter', required: true },
        title: { type: String, required: true, trim: true },
        location: { type: String, required: true, trim: true },
        salaryMin: { type: Number, default: null },
        salaryMax: { type: Number, default: null },
        skillsRequired: { type: [String], default: [] },
        experienceRequired: {
            type: String,
            enum: ["Fresher", "0-1", "1-3", "3-5", "5-10", "10+"],
            default: "Fresher",
        },
        description: { type: String, required: true, trim: true },
        status: { type: String, enum: ['open', 'closed'], default: 'open' },
    },
    { timestamps: true }
);

export default mongoose.model('Job', jobSchema);