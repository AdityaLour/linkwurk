import express from "express"
import { signUp, login, logout, googleAuth, getMe } from "../controllers/authController.js"

const router = express.Router()

router.post("/signup", signUp)
router.post('/login', login);
router.post("/logout", logout)
router.post('/google', googleAuth);
router.get('/me', getMe);

export default router