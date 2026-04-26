import { errorResponse, successResponse } from '../../utils/response.js';
import {
  createCoTravellerByUserId,
  deleteCoTravellerByUserId,
  getCoTravellersByUserId,
  getProfileByUserId,
  resetPasswordByUserId,
  verifyCurrentPasswordByUserId,
  updateCoTravellerByUserId,
  upsertProfileByUserId
} from './profile.service.js';

const getValidatedCoTravellerId = (req, res) => {
  const parsedId = Number.parseInt(req.params.id, 10);

  if (!Number.isInteger(parsedId) || parsedId <= 0) {
    errorResponse(res, 400, 'Invalid co-traveller id');
    return null;
  }

  return parsedId;
};

const handleControllerError = (res, error, fallbackMessage) => {
  if (error?.statusCode) {
    return errorResponse(res, error.statusCode, error.message);
  }

  if (error?.code === 'ER_DUP_ENTRY') {
    return errorResponse(res, 409, 'Duplicate co-traveller entry for this user');
  }

  console.error('[Profile] Controller error:', error);
  return errorResponse(res, 500, fallbackMessage);
};

export const getProfile = async (req, res) => {
  const userId = req.user.userId;
  console.log(`[Profile][GET /api/profile] userId=${userId}`);

  try {
    const profileData = await getProfileByUserId(userId);
    return successResponse(res, 200, 'Profile fetched successfully', profileData);
  } catch (error) {
    return handleControllerError(res, error, 'Failed to fetch profile');
  }
};

export const updateProfile = async (req, res) => {
  const userId = req.user.userId;
  console.log(`[Profile][PUT /api/profile] userId=${userId}`);

  try {
    const result = await upsertProfileByUserId(userId, req.body || {});
    const profileData = await getProfileByUserId(userId);

    return successResponse(
      res,
      200,
      `Profile ${result.operationType.toLowerCase()} successful`,
      profileData
    );
  } catch (error) {
    return handleControllerError(res, error, 'Failed to update profile');
  }
};

export const resetPassword = async (req, res) => {
  const userId = req.user.userId;
  console.log(`[Profile][PUT /api/profile/password] userId=${userId}`);

  try {
    await resetPasswordByUserId(userId, req.body || {});
    return successResponse(res, 200, 'Password reset successful');
  } catch (error) {
    return handleControllerError(res, error, 'Failed to reset password');
  }
};

export const verifyCurrentPassword = async (req, res) => {
  const userId = req.user.userId;
  console.log(`[Profile][POST /api/profile/password/verify] userId=${userId}`);

  try {
    await verifyCurrentPasswordByUserId(userId, req.body || {});
    return successResponse(res, 200, 'Password matched successfully');
  } catch (error) {
    return handleControllerError(res, error, 'Failed to verify password');
  }
};

export const getCoTravellers = async (req, res) => {
  const userId = req.user.userId;
  console.log(`[Profile][GET /api/profile/cotravellers] userId=${userId}`);

  try {
    const coTravellers = await getCoTravellersByUserId(userId);
    return successResponse(res, 200, 'Co-travellers fetched successfully', { coTravellers });
  } catch (error) {
    return handleControllerError(res, error, 'Failed to fetch co-travellers');
  }
};

export const createCoTraveller = async (req, res) => {
  const userId = req.user.userId;
  console.log(`[Profile][POST /api/profile/cotravellers] userId=${userId}`);

  try {
    const coTraveller = await createCoTravellerByUserId(userId, req.body || {});
    return successResponse(res, 201, 'Co-traveller created successfully', { coTraveller });
  } catch (error) {
    return handleControllerError(res, error, 'Failed to create co-traveller');
  }
};

export const updateCoTraveller = async (req, res) => {
  const userId = req.user.userId;
  const coTravellerId = getValidatedCoTravellerId(req, res);

  if (!coTravellerId) {
    return;
  }

  console.log(`[Profile][PUT /api/profile/cotravellers/:id] userId=${userId} coTravellerId=${coTravellerId}`);

  try {
    const coTraveller = await updateCoTravellerByUserId(userId, coTravellerId, req.body || {});
    return successResponse(res, 200, 'Co-traveller updated successfully', { coTraveller });
  } catch (error) {
    return handleControllerError(res, error, 'Failed to update co-traveller');
  }
};

export const deleteCoTraveller = async (req, res) => {
  const userId = req.user.userId;
  const coTravellerId = getValidatedCoTravellerId(req, res);

  if (!coTravellerId) {
    return;
  }

  console.log(`[Profile][DELETE /api/profile/cotravellers/:id] userId=${userId} coTravellerId=${coTravellerId}`);

  try {
    const result = await deleteCoTravellerByUserId(userId, coTravellerId);
    return successResponse(res, 200, 'Co-traveller deleted successfully', result);
  } catch (error) {
    return handleControllerError(res, error, 'Failed to delete co-traveller');
  }
};
