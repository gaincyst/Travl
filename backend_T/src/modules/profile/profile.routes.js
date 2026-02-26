import express from 'express';
import { authenticate } from '../../middleware/auth.js';
import { successResponse } from '../../utils/response.js';

const router = express.Router();

// Example protected route - GET /api/profile
router.get('/', authenticate, (req, res) => {
  // This is a placeholder for future profile implementation
  return successResponse(res, 200, 'Profile endpoint (coming soon)', {
    userId: req.user.userId,
    email: req.user.email
  });
});

export default router;
