import mongoose from "mongoose";

const userSchema = new.mongoose.Schema(
    {
        firstName: { type: String, required: true, trim: true },
        lastName: { type: String, trim: true },
        email: { type: String, required: true, unique: true, lowercase: true, trim: true },
        password: {
            type: String, required: function () {
                return this.authType === "email"
            }
        },
        authType: { type: String, enum: ["email", "google"], required: true, default: "email" },
        role: {
            type: String,
            enum: ["admin", "recruiter", "candidate"],
            required: true
        },
        isActive: {
            type: Boolean, default: true
        }
    }, {
    timeStamps: true
}
)

export default mongoose.model("User", userSchema)