import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import User from '../models/User.js';

const seedAdmin = async () => {
    await mongoose.connect(process.env.MONGO_URI);

    const existing = await User.findOne({ email: 'admin@linkwurk.com' });
    if (existing) {
        console.log('Admin already exists');
        process.exit(0);
    }

    const hashedPassword = await bcrypt.hash(process.env.ADMIN_SEED_PASSWORD, 10);

    await User.create({
        firstName: 'Admin',
        lastName: 'User',
        email: 'admin@linkwurk.com',
        password: hashedPassword,
        authType: 'email',
        role: 'admin',
    });

    process.exit(0);
};

seedAdmin();