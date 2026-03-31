import express from 'express';
import { signup, login, googleLogin } from './auth.controller.js';

const router = express.Router();

// POST /api/auth/signup - Register new user
router.post('/signup', signup);

// POST /api/auth/login - Login user
router.post('/login', login);

// POST /api/auth/google - Login or signup with Google credential token
router.post('/google', googleLogin);

export default router;
