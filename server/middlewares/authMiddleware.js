export const requireAuth = (req, res, next) => {
    if (!req.session.userId) {
        return res.status(401).json({ message: 'Not authenticated' });
    }
    next();
};

export const requireRole = (role) => (req, res, next) => {
    if (req.session.role !== role) {
        return res.status(403).json({ message: 'Forbidden' });
    }
    next();
};