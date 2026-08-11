import User from '../models/User.js';
import Recruiter from '../models/Recruiter.js';
import Job from '../models/Job.js';

const startOfToday = () => { const d = new Date(); d.setHours(0, 0, 0, 0); return d; };
const startOfWeek = () => { const d = startOfToday(); d.setDate(d.getDate() - d.getDay()); return d; };
const startOfMonth = () => { const d = new Date(); d.setDate(1); d.setHours(0, 0, 0, 0); return d; };
const startOfCalendarYear = () => { const d = new Date(); d.setMonth(0, 1); d.setHours(0, 0, 0, 0); return d; };
const startOfLastYear = () => { const d = startOfCalendarYear(); d.setFullYear(d.getFullYear() - 1); return d; };

const formatHour = (h) => {
    if (h === 0) return '12am';
    if (h < 12) return `${h}am`;
    if (h === 12) return '12pm';
    return `${h - 12}pm`;
};

const getHourlyToday = async (Model, matchExtra = {}) => {
    const today = startOfToday();
    const results = await Model.aggregate([
        { $match: { createdAt: { $gte: today }, ...matchExtra } },
        { $group: { _id: { $hour: '$createdAt' }, count: { $sum: 1 } } },
    ]);
    const map = {};
    results.forEach((r) => { map[r._id] = r.count; });
    const timeline = [];
    for (let h = 0; h < 24; h++) {
        timeline.push({ label: formatHour(h), count: map[h] || 0 });
    }
    return timeline;
};

const getDailyThisWeek = async (Model, matchExtra = {}) => {
    const week = startOfWeek();
    const results = await Model.aggregate([
        { $match: { createdAt: { $gte: week }, ...matchExtra } },
        { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, count: { $sum: 1 } } },
    ]);
    const map = {};
    results.forEach((r) => { map[r._id] = r.count; });
    const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const timeline = [];
    for (let i = 0; i < 7; i++) {
        const d = new Date(week);
        d.setDate(week.getDate() + i);
        const key = d.toISOString().slice(0, 10);
        timeline.push({ label: dayLabels[i], count: map[key] || 0 });
    }
    return timeline;
};

const getWeeklyThisMonth = async (Model, matchExtra = {}) => {
    const month = startOfMonth();
    const results = await Model.aggregate([
        { $match: { createdAt: { $gte: month }, ...matchExtra } },
        { $group: { _id: { $dayOfMonth: '$createdAt' }, count: { $sum: 1 } } },
    ]);
    const map = {};
    results.forEach((r) => { map[r._id] = r.count; });

    const daysInMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
    const weekBuckets = [];
    let dayStart = 1;
    let weekNum = 1;
    while (dayStart <= daysInMonth) {
        const dayEnd = Math.min(dayStart + 6, daysInMonth);
        let count = 0;
        for (let d = dayStart; d <= dayEnd; d++) count += map[d] || 0;
        weekBuckets.push({ label: `Week ${weekNum}`, count });
        dayStart = dayEnd + 1;
        weekNum++;
    }
    return weekBuckets;
};

const getMonthlyLastYear = async (Model, matchExtra = {}) => {
    const rangeStart = startOfLastYear();
    const rangeEnd = startOfCalendarYear();

    const results = await Model.aggregate([
        { $match: { createdAt: { $gte: rangeStart, $lt: rangeEnd }, ...matchExtra } },
        { $group: { _id: { $month: '$createdAt' }, count: { $sum: 1 } } },
    ]);
    const map = {};
    results.forEach((r) => { map[r._id] = r.count; });

    const monthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const timeline = [];
    for (let m = 1; m <= 12; m++) {
        timeline.push({ label: monthLabels[m - 1], count: map[m] || 0 });
    }
    return timeline;
};

const getMonthlyThisYear = async (Model, matchExtra = {}) => {
    const yearStart = startOfCalendarYear();
    const results = await Model.aggregate([
        { $match: { createdAt: { $gte: yearStart }, ...matchExtra } },
        { $group: { _id: { $month: '$createdAt' }, count: { $sum: 1 } } },
    ]);
    const map = {};
    results.forEach((r) => { map[r._id] = r.count; });

    const monthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const timeline = [];
    for (let m = 1; m <= 12; m++) {
        timeline.push({ label: monthLabels[m - 1], count: map[m] || 0 });
    }
    return timeline;
};

const getEntityStats = async (Model, matchExtra = {}) => {
    const today = startOfToday();
    const week = startOfWeek();
    const month = startOfMonth();
    const lastYearStart = startOfLastYear();
    const calendarYear = startOfCalendarYear();

    const [todayCount, weekCount, monthCount, pastYearCount, thisYearCount, totalCount, hourly, dailyThisWeek, weeklyThisMonth, monthlyLastYear, monthlyThisYear] = await Promise.all([
        Model.countDocuments({ ...matchExtra, createdAt: { $gte: today } }),
        Model.countDocuments({ ...matchExtra, createdAt: { $gte: week } }),
        Model.countDocuments({ ...matchExtra, createdAt: { $gte: month } }),
        Model.countDocuments({ ...matchExtra, createdAt: { $gte: lastYearStart, $lt: calendarYear } }),
        Model.countDocuments({ ...matchExtra, createdAt: { $gte: calendarYear } }),
        Model.countDocuments({ ...matchExtra }),
        getHourlyToday(Model, matchExtra),
        getDailyThisWeek(Model, matchExtra),
        getWeeklyThisMonth(Model, matchExtra),
        getMonthlyLastYear(Model, matchExtra),
        getMonthlyThisYear(Model, matchExtra),
    ]);

    return {
        today: todayCount,
        week: weekCount,
        month: monthCount,
        pastYear: pastYearCount,
        thisYear: thisYearCount,
        total: totalCount,
        timelines: { today: hourly, week: dailyThisWeek, month: weeklyThisMonth, pastYear: monthlyLastYear, thisYear: monthlyThisYear },
    };
};

export const getPlatformStats = async (req, res) => {
    try {
        const [candidates, recruiters, jobsBase, activeJobs, recentUsers, recentJobs] = await Promise.all([
            getEntityStats(User, { role: 'candidate' }),
            getEntityStats(User, { role: 'recruiter' }),
            getEntityStats(Job, {}),
            Job.countDocuments({ status: 'open' }),
            User.find().select('firstName lastName email role createdAt').sort({ createdAt: -1 }).limit(5),
            Job.find().populate('recruiterId', 'companyName').sort({ createdAt: -1 }).limit(5),
        ]);

        res.status(200).json({
            candidates,
            recruiters,
            jobs: { ...jobsBase, active: activeJobs },
            recentUsers,
            recentJobs,
        });
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch platform stats', error: err.message });
    }
};

export const getAllUsers = async (req, res) => {
    try {
        const filter = {};
        if (req.query.role) filter.role = req.query.role;
        if (req.query.search) {
            const searchRegex = { $regex: req.query.search, $options: 'i' };
            filter.$or = [{ firstName: searchRegex }, { lastName: searchRegex }, { email: searchRegex }];
        }
        const users = await User.find(filter).select('-passwordHash').sort({ createdAt: -1 });
        res.status(200).json({ users });
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch users', error: err.message });
    }
};

export const toggleUserStatus = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        if (user.role === 'admin') {
            return res.status(403).json({ message: 'Cannot deactivate an admin account' });
        }
        user.isActive = !user.isActive;
        await user.save();
        res.status(200).json({ user: { _id: user._id, isActive: user.isActive } });
    } catch (err) {
        res.status(500).json({ message: 'Failed to update user status', error: err.message });
    }
};

export const verifyUserEmail = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        if (user.isEmailVerified) {
            return res.status(400).json({ message: 'User is already verified' });
        }
        user.isEmailVerified = true;
        await user.save();
        res.status(200).json({ user: { _id: user._id, isEmailVerified: user.isEmailVerified } });
    } catch (err) {
        res.status(500).json({ message: 'Failed to verify user email', error: err.message });
    }
};

export const getAllRecruitersWithStats = async (req, res) => {
    try {
        const recruiters = await Recruiter.find().populate('userId', 'firstName lastName email isActive isEmailVerified createdAt');
        const recruiterIds = recruiters.map((r) => r._id);

        const jobCounts = await Job.aggregate([
            { $match: { recruiterId: { $in: recruiterIds } } },
            { $group: { _id: '$recruiterId', count: { $sum: 1 } } },
        ]);
        const countMap = {};
        jobCounts.forEach((jc) => { countMap[jc._id.toString()] = jc.count; });

        const result = recruiters.map((r) => ({
            _id: r._id,
            userId: r.userId,
            companyName: r.companyName,
            companyLogo: r.companyLogo,
            numberOfEmployees: r.numberOfEmployees,
            jobCount: countMap[r._id.toString()] || 0,
        }));

        res.status(200).json({ recruiters: result });
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch recruiters', error: err.message });
    }
};

export const getRecruiterDetail = async (req, res) => {
    try {
        const recruiter = await Recruiter.findById(req.params.id).populate('userId', 'firstName lastName email isActive isEmailVerified createdAt');
        if (!recruiter) return res.status(404).json({ message: 'Recruiter not found' });

        const jobs = await Job.find({ recruiterId: recruiter._id }).select('title status createdAt').sort({ createdAt: -1 });
        const activeCount = jobs.filter((j) => j.status === 'open').length;
        const closedCount = jobs.filter((j) => j.status === 'closed').length;

        res.status(200).json({
            recruiter: {
                _id: recruiter._id,
                userId: recruiter.userId,
                companyName: recruiter.companyName,
                companyLogo: recruiter.companyLogo,
                numberOfEmployees: recruiter.numberOfEmployees,
            },
            jobs,
            activeCount,
            closedCount,
        });
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch recruiter detail', error: err.message });
    }
};