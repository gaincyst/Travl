import { pool } from '../../config/database.js';
import bcrypt from 'bcryptjs';
import { generateToken } from '../../utils/jwt.js';

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
