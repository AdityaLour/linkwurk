import Recruiter from "../models/Recruiter.js";
import { uploadToImageKit } from '../lib/imageUpload.js';

export const getRecruiterProfile = async (req, res) => {
    try {
        const recruiter = await Recruiter.findOne({ userId: req.session.userId })
        if (!recruiter) {
            return res.status(404).json({ message: "Recruiter profile not found" })
        }
        return res.status(200).json({ recruiter });

    } catch (error) {
        return res.status(500).json({
            message: 'Failed to fetch profile',
            error: error.message
        });

    }
}

export const updateRecruiterProfile = async (req, res) => {
    try {
        const recruiter = await Recruiter.findOne({ userId: req.session.userId });
        if (!recruiter) return res.status(404).json({ message: 'Recruiter profile not found' });

        const { companyName, website, numberOfEmployees, companyTagline, address } = req.body

        if (companyName !== undefined) recruiter.companyName = companyName;
        if (website !== undefined) recruiter.website = website;
        if (numberOfEmployees !== undefined) recruiter.numberOfEmployees = numberOfEmployees;
        if (companyTagline !== undefined) recruiter.companyTagline = companyTagline;
        if (address !== undefined) recruiter.address = address;

        if (req.files?.profilePicture) {
            recruiter.profilePicture = await uploadToImageKit(req.files.profilePicture[0], 'recruiters/profile-pictures');
        }
        if (req.files?.companyLogo) {
            recruiter.companyLogo = await uploadToImageKit(req.files.companyLogo[0], 'recruiters/company-logos');
        }

        await recruiter.save();
        return res.status(200).json({
            message: "Recruiter profile updated successfully",
            recruiter
        });

    } catch (error) {
        return res.status(500).json(
            {
                message: 'Failed to update profile',
                error: error.message
            });
    }
}