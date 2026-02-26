# 🔐 Authentication Integration Guide

## Overview
This document explains the authentication system integrated into your Travel application frontend, connecting it with the backend API.

---

## 🎯 What's Been Implemented

### 1. **Login & Signup Modal** (`AuthModal.jsx`)
- ✅ Full API integration with backend
- ✅ Form validation (email, password, confirm password)
- ✅ Terms of Service checkbox for signup
- ✅ Real-time error and success messages
- ✅ Loading states during API calls
- ✅ Automatic token storage in localStorage
- ✅ Auto-redirect after successful authentication

### 2. **Authentication Utilities** (`utils/auth.js`)
- ✅ `isAuthenticated()` - Check if user is logged in
- ✅ `getCurrentUser()` - Get current user data
- ✅ `getToken()` - Retrieve auth token
- ✅ `logout()` - Clear session and redirect
- ✅ `fetchWithAuth()` - Make authenticated API requests

### 3. **API Configuration** (`utils/api.js`)
- ✅ Centralized API endpoint management
- ✅ Auto-attach authentication headers
- ✅ Error handling wrapper
- ✅ Base URL configuration

### 4. **Protected Routes** (`ProtectedRoute.jsx`)
- ✅ Blocks unauthenticated users from accessing protected pages
- ✅ Shows alert and redirects to home
- ✅ Used for `/my-trips` and `/hotel-booking`

### 5. **Navbar Updates** (`Navbar.jsx`)
- ✅ Shows user name when logged in
- ✅ User dropdown with email display
- ✅ Logout button with icon
- ✅ Dynamic UI based on authentication state

---

## 📋 How It Works

### User Registration Flow

1. User clicks **"Create an Account"** in navbar
2. Modal opens showing **Register** form
3. User fills in:
   - Full Name
   - Email
   - Password (min 6 chars)
   - Confirm Password
   - Agrees to Terms of Service ✓
4. Clicks **REGISTER** button
5. Frontend sends POST to `/api/auth/signup`:
   ```json
   {
     "name": "John Doe",
     "email": "john@example.com",
     "password": "password123",
     "confirmPassword": "password123"
   }
   ```
6. Backend validates and creates user
7. Returns JWT token and user data
8. Token + user data saved to localStorage
9. Page refreshes to update UI
10. User is now logged in! ✅

### User Login Flow

1. User clicks **"Login / Signup"** in navbar
2. Modal opens showing **Sign In** form
3. User fills in:
   - Email
   - Password
4. Clicks **SIGN IN** button
5. Frontend sends POST to `/api/auth/login`:
   ```json
   {
     "email": "john@example.com",
     "password": "password123"
   }
   ```
6. Backend validates credentials
7. Returns JWT token and user data
8. Token + user data saved to localStorage
9. Page refreshes to update UI
10. User is now logged in! ✅

### Protected Page Access

1. User tries to visit `/my-trips` or `/hotel-booking`
2. `ProtectedRoute` checks `isAuthenticated()`
3. If **NOT logged in**:
   - Alert: "Please login to access this page"
   - Redirect to home (`/`)
4. If **logged in**:
   - Page loads normally ✅

### Logout Flow

1. User hovers over their name in navbar
2. Dropdown shows with **Logout** button
3. User clicks **Logout**
4. `logout()` function:
   - Removes token from localStorage
   - Removes user data from localStorage
   - Redirects to home
5. Navbar shows "Login / Signup" again

---

## 💾 Data Storage

### LocalStorage Items

| Key | Description | Example |
|-----|-------------|---------|
| `token` | JWT authentication token | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` |
| `user` | User information (JSON) | `{"userId":1,"name":"John","email":"john@example.com"}` |

### Accessing User Data

```javascript
import { getCurrentUser, getToken } from './utils/auth';

// Get current user
const user = getCurrentUser();
console.log(user.name); // "John Doe"
console.log(user.email); // "john@example.com"

// Get token
const token = getToken();
```

---

## 🔒 Making Authenticated API Calls

### Method 1: Using `fetchWithAuth`

```javascript
import { fetchWithAuth } from './utils/auth';

const getProfile = async () => {
  try {
    const response = await fetchWithAuth('http://localhost:5000/api/profile');
    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.error('Error:', error);
  }
};
```

### Method 2: Using `apiCall` helper

```javascript
import { apiCall, API_ENDPOINTS } from './utils/api';

const getProfile = async () => {
  const result = await apiCall(API_ENDPOINTS.PROFILE, {
    method: 'GET'
  });
  
  if (result.success) {
    console.log(result.data);
  } else {
    console.error(result.error);
  }
};
```

### Method 3: Manual fetch with headers

```javascript
import { getToken } from './utils/auth';

const response = await fetch('http://localhost:5000/api/profile', {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${getToken()}`,
    'Content-Type': 'application/json'
  }
});
```

---

## 🎨 UI Components

### Login/Signup Modal Features

- **Password visibility toggle** (eye icon)
- **Error messages** (red background)
- **Success messages** (green background)
- **Loading state** (button shows "Processing...")
- **Form validation**:
  - All fields required
  - Valid email format
  - Password min 6 characters
  - Passwords must match (signup)
  - Terms must be agreed (signup)
- **Mode switching** (Login ↔ Register)

### Navbar User Menu

When logged in, navbar shows:
- User icon + name
- Hover to see dropdown:
  - User's full name (bold)
  - User's email (gray)
  - Logout button (red)

---

## 🚫 Protected Pages

Currently protected:
- ✅ `/my-trips` - My Trips page
- ✅ `/hotel-booking` - Hotel Booking page

To protect more pages, wrap them in `ProtectedRoute`:

```jsx
<Route path="/your-page" element={
  <ProtectedRoute>
    <YourPage />
  </ProtectedRoute>
} />
```

---

## ⚙️ Configuration

### Change Backend URL

Update in `src/components/AuthModal.jsx` and `src/utils/api.js`:

```javascript
const API_BASE_URL = "http://your-backend-url:5000/api";
```

### Change Token Expiry

Backend setting in `backend_T/.env`:
```env
JWT_EXPIRES_IN=7d
```

---

## 🧪 Testing the Integration

### 1. Start Backend
```bash
cd backend_T
node server.js
```
Backend should be running on `http://localhost:5000`

### 2. Start Frontend
```bash
cd vite-project
npm run dev
```
Frontend should be running on `http://localhost:5173`

### 3. Test Registration
1. Open browser: `http://localhost:5173`
2. Click "Login / Signup"
3. Click "Create an Account"
4. Fill form and submit
5. Check if:
   - Success message appears
   - Modal closes
   - Navbar shows your name

### 4. Test Login
1. Logout (hover on name → click Logout)
2. Click "Login / Signup"
3. Enter credentials and submit
4. Check if logged in successfully

### 5. Test Protected Routes
1. Logout
2. Try visiting: `http://localhost:5173/my-trips`
3. Should see alert and redirect to home
4. Login
5. Try visiting `/my-trips` again
6. Should load successfully

### 6. Test API in Console

Open browser console (F12) and run:

```javascript
// Check if logged in
const user = JSON.parse(localStorage.getItem('user'));
console.log('Current User:', user);

// Check token
const token = localStorage.getItem('token');
console.log('Token:', token);
```

---

## 🐛 Troubleshooting

### Issue: "Unable to connect to server"
**Solution:** Make sure backend is running on `http://localhost:5000`

### Issue: "Access denied for user 'root'@'localhost'"
**Solution:** Check MySQL is running and password is correct in `backend_T/.env`

### Issue: Token expired / Invalid token
**Solution:** Logout and login again to get a new token

### Issue: Protected pages not working
**Solution:** Check if token exists in localStorage (F12 → Application → Local Storage)

### Issue: CORS errors
**Solution:** Backend should allow frontend origin in `src/app.js`:
```javascript
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
```

---

## 📝 API Endpoints Used

| Endpoint | Method | Auth Required | Description |
|----------|--------|---------------|-------------|
| `/api/auth/signup` | POST | ❌ | Register new user |
| `/api/auth/login` | POST | ❌ | Login user |
| `/api/profile` | GET | ✅ | Get user profile |
| `/api/health` | GET | ❌ | Health check |

---

## 🔐 Security Features

✅ Passwords hashed with bcrypt (backend)
✅ JWT tokens with expiration
✅ Protected routes on frontend
✅ Authentication middleware on backend
✅ Input validation on both frontend & backend
✅ XSS protection (input sanitization)
✅ Secure password visibility toggle

---

## 📚 Files Modified/Created

### Created:
- ✅ `src/utils/auth.js` - Auth utilities
- ✅ `src/utils/api.js` - API configuration
- ✅ `src/components/ProtectedRoute.jsx` - Route guard
- ✅ `vite-project/AUTHENTICATION_GUIDE.md` - This file

### Modified:
- ✅ `src/components/AuthModal.jsx` - Added API integration
- ✅ `src/components/Navbar.jsx` - Added user menu & logout
- ✅ `src/App.jsx` - Added protected routes
- ✅ `src/styles/globals.css` - Added user menu styles

---

## 🎉 You're All Set!

Your Travel application now has:
- ✅ Complete user authentication
- ✅ Login & registration
- ✅ Protected pages
- ✅ User session management
- ✅ Secure token-based auth
- ✅ Beautiful UI with error handling

**Next Steps:**
1. Test all flows (signup, login, logout)
2. Add more protected routes as needed
3. Implement profile page functionality
4. Add booking features with user association

---

**Need Help?** Check:
- Backend README: `backend_T/README.md`
- Postman Collection: `backend_T/Travel_API_Postman_Collection.json`
- API Guide: `backend_T/POSTMAN_GUIDE.md`
