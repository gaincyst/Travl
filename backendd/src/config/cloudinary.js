import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

// Configure Cloudinary with credentials from environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME?.trim(),
  api_key: process.env.CLOUDINARY_API_KEY?.trim(),
  api_secret: process.env.CLOUDINARY_API_SECRET?.trim(),
  secure: true
});

// Verify Cloudinary configuration
const isConfigured = () => {
  return !!(process.env.CLOUDINARY_CLOUD_NAME && 
            process.env.CLOUDINARY_API_KEY && 
            process.env.CLOUDINARY_API_SECRET);
};

if (!isConfigured()) {
  console.warn('⚠️  Cloudinary not fully configured. Check environment variables:');
  console.warn('   - CLOUDINARY_CLOUD_NAME');
  console.warn('   - CLOUDINARY_API_KEY');
  console.warn('   - CLOUDINARY_API_SECRET');
}

export { cloudinary, isConfigured };
