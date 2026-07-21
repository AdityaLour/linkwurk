import express from "express"
import { signUp, login, logout, googleAuth } from "../controllers/authController.js"

const router = express.Router()

router.post("/signup", signUp)
router.post('/login', login);
router.post("/logout", logout)
router.post('/google', googleAuth);

export default router