import express from 'express';
import authRoutes from '../modules/auth/auth.routes.js';
import profileRoutes from '../modules/profile/profile.routes.js';

const router = express.Router();

// Health check endpoint
router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Travel API is running',
    timestamp: new Date().toISOString()
  });
});

// Module routes
router.use('/auth', authRoutes);
router.use('/profile', profileRoutes);

export default router;
