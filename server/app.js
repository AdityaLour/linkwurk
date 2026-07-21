import dotenv from "dotenv"
dotenv.config()
import express from "express"
import cors from "cors"
import mongoose from "mongoose"

import sessionMiddleware from "./config/session.js"
import authRoutes from './routes/authRoutes.js';

const app = express()
app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
}))

app.use(express.json());
app.use(sessionMiddleware());
app.use('/api/auth', authRoutes);

const PORT = process.env.PORT | 5000

mongoose.connect(process.env.MONGO_URI).then(() => {
    app.listen(PORT, () => {
        console.log("Server is Running")
    })
}).catch((error) => {
    console.log("DB connection failed")
})