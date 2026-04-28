# Profile Avatar Upload Setup Guide

## Overview
This guide explains how to set up and test the profile avatar upload feature with Cloudinary integration.

## Prerequisites

### 1. Cloudinary Account
You need a Cloudinary account to upload images to the cloud.

**Steps to get Cloudinary credentials:**
1. Sign up at [https://cloudinary.com](https://cloudinary.com)
2. Go to Dashboard
3. Find your "Cloud Name", "API Key", and "API Secret"
4. These are your credentials for the .env file

### 2. Backend Dependencies
The required packages are already installed:
- `cloudinary` - for uploading to Cloudinary
- `multer` - for handling file uploads

Verify in `backendd/package.json`:
```json
{
  "cloudinary": "^2.10.0",
  "multer": "^2.1.1"
}
```

## Configuration

### 1. Update Backend .env
Add your Cloudinary credentials to `backendd/.env`:

```env
# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

Replace the values with your actual Cloudinary credentials.

### 2. Database Check
Ensure your `user_profiles` table has the `avatar_url` column:

```sql
SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_NAME='user_profiles' AND COLUMN_NAME='avatar_url';
```

If the column is missing, add it:

```sql
ALTER TABLE user_profiles ADD COLUMN avatar_url VARCHAR(500) NULL;
```

## API Endpoints

### Upload Avatar
**POST** `/api/profile/avatar`

**Headers:**
```
Authorization: Bearer <JWT_TOKEN>
Content-Type: multipart/form-data
```

**Body:**
- `avatar` (file) - Image file (JPG, PNG, JPEG). Max size: 2MB

**Request Example:**
```javascript
const formData = new FormData();
formData.append('avatar', fileInput.files[0]);

fetch('/api/profile/avatar', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`
  },
  body: formData
})
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Avatar uploaded successfully",
  "data": {
    "success": true,
    "avatarUrl": "https://res.cloudinary.com/..."
  }
}
```

**Error Responses:**
- `400` - No file uploaded or invalid file type/size
- `401` - Unauthorized (missing or invalid JWT token)
- `500` - Server error during upload

## Testing Locally

### 1. Start Backend
```bash
cd backendd
npm run dev
```

### 2. Start Frontend
```bash
cd vite-project
npm run dev
```

### 3. Test Avatar Upload
1. Open the app at `http://localhost:5173`
2. Login with your account
3. Go to Profile page
4. Click on the avatar circle (with camera icon)
5. Select an image file (JPG, PNG)
6. Image should upload and display immediately
7. Refresh the page - avatar should persist

## What Was Implemented

### Backend
- **Config Files:**
  - `src/config/multer.js` - Multer setup for file handling
  - `src/config/cloudinary.js` - Cloudinary SDK configuration

- **Routes:**
  - `POST /api/profile/avatar` - Protected endpoint for avatar upload

- **Controller:**
  - `uploadAvatar()` - Handles avatar upload requests

- **Service:**
  - `updateAvatarByUserId()` - Uploads to Cloudinary, updates database

### Frontend
- **API Endpoint:**
  - `PROFILE_AVATAR: /api/profile/avatar`

- **Components:**
  - Avatar upload section in Profile page with:
    - Click-to-upload functionality
    - Image display
    - File validation (type & size)
    - Upload progress indicator
    - Error message display
    - Persistent storage (loads on page refresh)

### Database
- Avatar URL is stored in `user_profiles.avatar_url` column
- Updates use UPSERT logic (INSERT or UPDATE)

## Security Features

✅ **File Validation:**
- Only JPG, JPEG, PNG accepted
- Max 2MB file size
- Validated on both frontend and backend

✅ **Authentication:**
- JWT token required via Authorization header
- Only logged-in users can upload
- User ID obtained from JWT (not from frontend)

✅ **Cloudinary Security:**
- Private API credentials in backend only
- Images stored in `voyago_profiles` folder
- Secure HTTPS URLs returned

## Troubleshooting

### Upload fails with "Cloudinary not configured"
- Check .env file has all three Cloudinary variables
- Ensure backend is restarted after .env changes

### "No file uploaded" error
- Ensure file input includes the file
- Check FormData has "avatar" key (not "file" or other names)

### "File too large" error
- Maximum 2MB file size
- Compress image before uploading

### Avatar doesn't persist after refresh
- Check browser console for errors
- Verify database connection
- Check `avatar_url` column exists in `user_profiles` table

### CORS errors
- Verify frontend URL matches `FRONTEND_URL` in .env
- Default: `http://localhost:5173`

## File Structure

```
backendd/
├── .env                           # Environment variables
├── src/
│   ├── config/
│   │   ├── cloudinary.js          # ✨ NEW
│   │   └── multer.js              # ✨ NEW
│   ├── modules/profile/
│   │   ├── profile.controller.js  # ✨ UPDATED (added uploadAvatar)
│   │   ├── profile.service.js     # ✨ UPDATED (added updateAvatarByUserId)
│   │   └── profile.routes.js      # ✨ UPDATED (added avatar route)

vite-project/
├── src/
│   ├── utils/
│   │   └── api.js                 # ✨ UPDATED (added PROFILE_AVATAR endpoint)
│   └── pages/
│       └── ProfilePage.jsx        # ✨ UPDATED (added avatar upload UI)
```

## Next Steps

1. **Configure Cloudinary:** Add credentials to `.env`
2. **Test Locally:** Follow testing steps above
3. **Deploy:** When ready, update Cloudinary credentials in production .env
4. **Monitor:** Check Cloudinary dashboard for uploaded images

## Notes

- Images are stored in Cloudinary's `voyago_profiles` folder
- Each user's avatar uses public_id: `user_{userId}_avatar`
- Previous avatars are automatically overwritten (not duplicated)
- Avatar URLs are permanent and can be shared
