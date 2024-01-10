import express from 'express';
import { login, getProfile, signup, logout } from '../controller/admin.js';
import authMiddleware from '../middleware/auth.js';


const router = express.Router();

// router.get('/users', authMiddleware, getUsers);
router.get('/profile', authMiddleware, getProfile);
router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', logout);

export default router;
