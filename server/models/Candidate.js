import mongoose from 'mongoose';

const educationSchema = new mongoose.Schema({
    institution: String,
    degree: String,
    startYear: Number,
    endYear: Number,
});

const resumeSchema = new mongoose.Schema({
    url: { type: String, default: '' },
    fileName: { type: String, default: '' },
    uploadedAt: { type: Date, default: null },
});

const candidateSchema = new mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
        profilePicture: { type: String, default: '' },
        resume: { type: resumeSchema, default: () => ({}) },
        summary: { type: String, trim: true, default: '' },
        skills: { type: [String], default: [] },
        education: { type: [educationSchema], default: [] },
        certifications: { type: [String], default: [] }, // ImageKit image URLs only, nothing structured
    },
    { timestamps: true }
);

export default mongoose.model('Candidate', candidateSchema);