import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

// Create a connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'travel_db',
  port: parseInt(process.env.DB_PORT) || 3306,
  waitForConnections: true,
  connectionLimit: 5, // Lower limit for serverless
  queueLimit: 0,
  connectTimeout: 10000,
  // SSL configuration for cloud databases (Aiven, PlanetScale, etc.)
  // For Aiven: Accept self-signed certificates in production
  ssl: process.env.DB_HOST && process.env.DB_HOST !== 'localhost' 
    ? { 
        rejectUnauthorized: false // Required for Aiven's SSL certificates
      } 
    : undefined
});

// Test database connection (for serverless, this is called on-demand)
const testConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log('✅ MySQL Database connected successfully');
    connection.release();
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    throw error;
  }
};

export { pool, testConnection };
