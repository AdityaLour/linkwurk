import express from 'express';
import { searchUniversities } from '../controllers/universityController.js';

const router = express.Router();
router.get('/search', searchUniversities);

export default router;