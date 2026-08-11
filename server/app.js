import dotenv from "dotenv"
dotenv.config()
import express from "express"
import cors from "cors"
import mongoose from "mongoose"

import sessionMiddleware from "./config/session.js"
import authRoutes from './routes/authRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import recruiterRoutes from './routes/recruiterRoutes.js';
import candidateRoutes from './routes/candidateRoutes.js';
import jobRoutes from './routes/jobRoutes.js';
import applicationRoutes from './routes/applicationRoutes.js';
import interviewRoutes from './routes/interviewRoutes.js';
import savedJobRoutes from './routes/savedJobsRoutes.js';
import skillRoutes from './routes/skillRoutes.js';
import universityRoutes from './routes/universityRoutes.js';
import publicRoutes from './routes/publicRoute.js';



const app = express()
app.set('trust proxy', 1)
app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
}))

app.use(express.json());
app.use(sessionMiddleware());
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/recruiters', recruiterRoutes);
app.use('/api/candidates', candidateRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/interviews', interviewRoutes);
app.use('/api/saved-jobs', savedJobRoutes);
app.use('/api/skills', skillRoutes);
app.use('/api/universities', universityRoutes);
app.use('/api/public', publicRoutes);
app.get('/health', (req, res) => res.status(200).send('OK'));

const PORT = process.env.PORT | 5000

mongoose.connect(process.env.MONGO_URI).then(() => {
    app.listen(PORT, () => {
        console.log("Server is Running")
    })
}).catch((error) => {
    console.log("DB connection failed")
})