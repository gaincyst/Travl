import { pool } from '../../config/database.js';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { generateToken } from '../../utils/jwt.js';

const verifyGoogleCredentialToken = async (credentialToken) => {
  const verifyUrl = `https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(credentialToken)}`;
  const response = await fetch(verifyUrl);

  if (!response.ok) {
    return null;
  }

  const payload = await response.json();

  if (!payload?.aud || payload.aud !== process.env.GOOGLE_CLIENT_ID) {
    return null;
  }

  return payload;
};

// User signup service
export const signupService = async (name, email, password) => {
  try {
    // Check if user already exists
    const [existingUsers] = await pool.query(
      'SELECT id FROM users WHERE email = ?',
      [email]
    );
    
    if (existingUsers.length > 0) {
      return { success: false, message: 'Email already registered' };
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Insert new user
    const [result] = await pool.query(
      'INSERT INTO users (name, email, password, created_at) VALUES (?, ?, ?, NOW())',
      [name, email, hashedPassword]
    );
    
    const userId = result.insertId;
    
    // Generate token
    const token = generateToken(userId, email);
    
    return {
      success: true,
      data: {
        userId,
        name,
        email,
        token
      }
    };
  } catch (error) {
    console.error('Signup service error:', error);
    throw error;
  }
};

// User login service
export const loginService = async (email, password) => {
  try {
    // Find user by email
    const [users] = await pool.query(
      'SELECT id, name, email, password FROM users WHERE email = ?',
      [email]
    );
    
    if (users.length === 0) {
      return { success: false, message: 'Invalid email or password' };
    }
    
    const user = users[0];
    
    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      return { success: false, message: 'Invalid email or password' };
    }
    
    // Generate token
    const token = generateToken(user.id, user.email);
    
    return {
      success: true,
      data: {
        userId: user.id,
        name: user.name,
        email: user.email,
        token
      }
    };
  } catch (error) {
    console.error('Login service error:', error);
    throw error;
  }
};

// Google OAuth credential login service
export const googleLoginService = async (credentialToken) => {
  try {
    if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
      return { success: false, message: 'Google OAuth is not configured on server' };
    }

    const payload = await verifyGoogleCredentialToken(credentialToken);

    const isEmailVerified = payload?.email_verified === true || payload?.email_verified === 'true';

    if (!payload || !payload.email || !isEmailVerified) {
      return { success: false, message: 'Google account email is not verified' };
    }

    const email = payload.email;
    const name = payload.name || email.split('@')[0];

    const [users] = await pool.query(
      'SELECT id, name, email FROM users WHERE email = ?',
      [email]
    );

    let user;

    if (users.length === 0) {
      const randomPassword = crypto.randomBytes(32).toString('hex');
      const hashedPassword = await bcrypt.hash(randomPassword, 10);

      const [insertResult] = await pool.query(
        'INSERT INTO users (name, email, password, created_at) VALUES (?, ?, ?, NOW())',
        [name, email, hashedPassword]
      );

      user = {
        id: insertResult.insertId,
        name,
        email
      };
    } else {
      user = users[0];
    }

    const token = generateToken(user.id, user.email);

    return {
      success: true,
      data: {
        userId: user.id,
        name: user.name,
        email: user.email,
        token
      }
    };
  } catch (error) {
    console.error('Google login service error:', error);
    return { success: false, message: 'Invalid Google credential token' };
  }
};
