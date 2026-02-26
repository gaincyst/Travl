import express from 'express';
import { signup, login } from './auth.controller.js';

const router = express.Router();

// POST /api/auth/signup - Register new user
router.post('/signup', signup);

// POST /api/auth/login - Login user
router.post('/login', login);

export default router;
