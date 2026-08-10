import express from "express"
import { signUp, login, logout, googleAuth, getMe, verifyEmail, requestEmailVerification, updateEmail, updatePassword } from "../controllers/authController.js"
import { requireAuth } from '../middlewares/authMiddleware.js';

const router = express.Router()

router.post("/signup", signUp)
router.post('/login', login);
router.post("/logout", logout)
router.post('/google', googleAuth);
router.get('/me', getMe);

router.get('/verify-email', verifyEmail);
router.post('/send-verification-email', requireAuth, requestEmailVerification);
router.patch('/update-email', requireAuth, updateEmail);
router.patch('/update-password', requireAuth, updatePassword);
export default router