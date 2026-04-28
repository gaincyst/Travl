import express from 'express';
import { authenticate } from '../../middleware/auth.js';
import { uploadAvatar as multerUpload } from '../../config/multer.js';
import {
  createCoTraveller,
  deleteCoTraveller,
  getCoTravellers,
  getProfile,
  resetPassword,
  verifyCurrentPassword,
  updateCoTraveller,
  updateProfile,
  uploadAvatar,
  deleteAvatar
} from './profile.controller.js';

const router = express.Router();

router.use(authenticate);

// Profile
router.get('/', getProfile);
router.put('/', updateProfile);
router.put('/password', resetPassword);
router.post('/password/verify', verifyCurrentPassword);

// Avatar upload
router.post('/avatar', multerUpload.single('avatar'), uploadAvatar);
router.delete('/avatar', deleteAvatar);
router.post('/avatar/delete', deleteAvatar);

// Co-travellers
router.get('/cotravellers', getCoTravellers);
router.post('/cotravellers', createCoTraveller);
router.put('/cotravellers/:id', updateCoTraveller);
router.delete('/cotravellers/:id', deleteCoTraveller);

export default router;
