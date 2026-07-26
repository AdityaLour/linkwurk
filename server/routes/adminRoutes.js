import express from "express"
import { requireAuth, requireRole } from '../middlewares/authMiddleware.js';
import User from "../models/User.js";

const router = express.Router()

router.get('/users', requireAuth, requireRole('admin'), async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.status(200).json({ users });
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch users', error: err.message });
    }
});

export default router;

