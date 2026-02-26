import { verifyToken } from '../utils/jwt.js';
import { errorResponse } from '../utils/response.js';

export const authenticate = (req, res, next) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return errorResponse(res, 401, 'Access token is required');
    }
    
    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    
    // Verify token
    const decoded = verifyToken(token);
    
    if (!decoded) {
      return errorResponse(res, 401, 'Invalid or expired token');
    }
    
    // Attach user info to request
    req.user = {
      userId: decoded.userId,
      email: decoded.email
    };
    
    next();
  } catch (error) {
    return errorResponse(res, 401, 'Authentication failed');
  }
};
