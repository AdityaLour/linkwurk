import User from '../models/User.js';

export const requireAuth = async (req, res, next) => {
    if (!req.session.userId) {
        return res.status(401).json({ message: 'Not authenticated' });
    }

    const user = await User.findById(req.session.userId);
    if (!user || !user.isActive) {
        return res.status(401).json({ message: 'Your account has been deactivated' });
    }

    next();
};

export const requireRole = (role) => (req, res, next) => {
    if (req.session.role !== role) {
        return res.status(403).json({ message: 'Forbidden' });
    }
    next();
};

export const requireVerifiedEmail = async (req, res, next) => {
    const user = await User.findById(req.session.userId);
    if (!user.isEmailVerified) {
        return res.status(403).json({ message: 'Please verify your email before continuing' });
    }
    next();
};