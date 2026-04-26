import express from 'express';
import { authenticate } from '../../middleware/auth.js';
import {
  createCoTraveller,
  deleteCoTraveller,
  getCoTravellers,
  getProfile,
  resetPassword,
  verifyCurrentPassword,
  updateCoTraveller,
  updateProfile
} from './profile.controller.js';

const router = express.Router();

router.use(authenticate);

// Profile
router.get('/', getProfile);
router.put('/', updateProfile);
router.put('/password', resetPassword);
router.post('/password/verify', verifyCurrentPassword);

// Co-travellers
router.get('/cotravellers', getCoTravellers);
router.post('/cotravellers', createCoTraveller);
router.put('/cotravellers/:id', updateCoTraveller);
router.delete('/cotravellers/:id', deleteCoTraveller);

export default router;
