import express from 'express';
import { login, getProfile, signup, logout } from '../controller/dealership.js';
import authMiddleware from '../middleware/auth.js';


const router = express.Router();

router.get('/profile', authMiddleware, getProfile);
router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', logout);


export default router;