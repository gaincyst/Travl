import { signupService, loginService, googleLoginService } from './auth.service.js';
import { successResponse, errorResponse } from '../../utils/response.js';

// Signup controller
export const signup = async (req, res) => {
  try {
    const { name, email, password, confirmPassword } = req.body;
    
    // Validation
    if (!name || !email || !password || !confirmPassword) {
      return errorResponse(res, 400, 'All fields are required');
    }
    
    // Check if passwords match
    if (password !== confirmPassword) {
      return errorResponse(res, 400, 'Passwords do not match');
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return errorResponse(res, 400, 'Invalid email format');
    }
    
    // Password strength validation (minimum 6 characters)
    if (password.length < 6) {
      return errorResponse(res, 400, 'Password must be at least 6 characters');
    }
    
    // Call signup service
    const result = await signupService(name, email, password);
    
    if (!result.success) {
      return errorResponse(res, 400, result.message);
    }
    
    return successResponse(res, 201, 'User registered successfully', result.data);
  } catch (error) {
    console.error('Signup controller error:', error);
    return errorResponse(res, 500, 'Internal server error');
  }
};

// Login controller
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Validation
    if (!email || !password) {
      return errorResponse(res, 400, 'Email and password are required');
    }
    
    // Call login service
    const result = await loginService(email, password);
    
    if (!result.success) {
      return errorResponse(res, 401, result.message);
    }
    
    return successResponse(res, 200, 'Login successful', result.data);
  } catch (error) {
    console.error('Login controller error:', error);
    return errorResponse(res, 500, 'Internal server error');
  }
};

// Google OAuth login controller
export const googleLogin = async (req, res) => {
  try {
    const { credential } = req.body;

    if (!credential) {
      return errorResponse(res, 400, 'Google credential token is required');
    }

    const result = await googleLoginService(credential);

    if (!result.success) {
      return errorResponse(res, 401, result.message);
    }

    return successResponse(res, 200, 'Google login successful', result.data);
  } catch (error) {
    console.error('Google login controller error:', error);
    return errorResponse(res, 500, 'Internal server error');
  }
};
