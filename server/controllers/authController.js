import bcrypt from "bcrypt"
import User from "../models/User.js"
import Recruiter from '../models/Recruiter.js';
import Candidate from '../models/Candidate.js';


export const signUp = async (req, res) => {
    try {
        const { firstName, lastName, email, password, role, authType } = req.body;

        if (!firstName || !email || !role) {
            return res.status(400).json({
                message: "Please provide all required fields",
            });
        }

        const cleanEmail = email.toLowerCase().trim()

        const existingUser = await User.findOne({ email: cleanEmail });
        if (existingUser) {
            return res.status(400).json({
                message: "Email Already Registered"
            })
        }

        if (password.length < 6) {
            return res.status(400).json({
                message: "Password must be atleast 6 characters long"
            })
        }

        if (!['candidate', 'recruiter'].includes(role)) {
            return res.status(400).json({ message: 'Invalid role' });
        }

        const resolvedAuthType = authType || 'email';
        if (resolvedAuthType === "email") {
            if (!password) {
                return res.status(400).json({
                    message: "Password is required"
                });
            }

            if (password.length < 6) {
                return res.status(400).json({
                    message: "Password must be at least 6 characters long"
                });
            }
        }

        let hashedPassword = undefined;
        if (resolvedAuthType === "email") {
            hashedPassword = await bcrypt.hash(password, 12);
        }

        const user = await User.create({
            firstName,
            lastName,
            email: cleanEmail,
            password: hashedPassword,
            role,
            authType: resolvedAuthType
        })

        if (role === "recruiter") {
            await Recruiter.create({ userId: user._id })
        }
        if (role === "candidate") {
            await Candidate.create({ userId: user._id })
        }

        req.session.userId = user._id;
        req.session.role = user.role;

        res.status(201).json({
            user: {
                id: user._id,
                firstName: user.firstName,
                role: user.role,
            },
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Registration Failed", error: error.message
        });
    }

}

export const login = async (req, res) => {
    try {
        const { email, password } = req.body

        if (!email || !password) {
            return res.status(404).json({ message: "Email and password is required" })
        }

        const user = await User.findOne({ email: email.toLowerCase() })
        if (!user) {
            return res.status(400).json({ message: "Invalid Credentials" })
        }


        if (!user.isActive) {
            return res.status(403).json({ message: 'Account has been deactivated' });
        }

        if (user.authType !== 'email') {
            return res.status(400).json({ message: `Please sign in with ${user.authType} instead` });
        }

        const comparePass = bcrypt.compare(password, user.password)

        req.session.userId = user._id;
        req.session.role = user.role;

        res.status(200).json({
            user: {
                id: user._id,
                firstName: user.firstName,
                role: user.role,
            },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Login failed', error: error.message });
    }
}

export const logout = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ message: 'Logout failed' });
        }
        res.clearCookie('connect.sid');
        res.status(200).json({ message: 'Logged out successfully' });
    });
};