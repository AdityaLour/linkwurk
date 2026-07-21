import mongoose from "mongoose";


const recruiterSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.ObjectId, ref: "User", required: true, unique: true },

    profilePicture: { type: String, default: "" },

    companyName: { type: String, trim: true, default: "" },
    companyLogo: { type: String, default: "" },
    website: { type: String, trim: true, default: "" },
    numberOfEmployees: {
        type: String,
        enum: [
            "1-10",
            "11-50",
            "51-200",
            "201-500",
            "500+"
        ],
        default: ""
    },
    companyTagline: { type: String, trim: true, default: "" },
    Address: { type: String, trim: true, default: "" },
}, {
    timestamps: true
})

export default mongoose.model('Recruiter', recruiterSchema);