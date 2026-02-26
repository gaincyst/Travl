# 📮 Postman Collection Guide

## 📁 Files Created

1. **Travel_API_Postman_Collection.json** - Complete API collection with all endpoints
2. **Travel_API_Environment.json** - Environment variables for local development

---

## 🚀 How to Import in Postman

### Step 1: Import Collection

1. Open **Postman**
2. Click **Import** button (top left)
3. Click **Choose Files**
4. Select: `Travel_API_Postman_Collection.json`
5. Click **Import**

### Step 2: Import Environment

1. Click **Import** button again
2. Select: `Travel_API_Environment.json`
3. Click **Import**
4. Select **"Travel API - Local"** environment from the dropdown (top right)

---

## 📡 Available APIs

### 🔓 Public Endpoints (No Authentication Required)

#### 1. Health Check
- **Method:** `GET`
- **URL:** `http://localhost:5000/api/health`
- **Description:** Check if server is running

#### 2. Root Endpoint
- **Method:** `GET`
- **URL:** `http://localhost:5000/`
- **Description:** Get API documentation

---

### 🔐 Authentication Endpoints

#### 3. Signup (Register)
- **Method:** `POST`
- **URL:** `http://localhost:5000/api/auth/signup`
- **Headers:** `Content-Type: application/json`
- **Body (JSON):**
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "confirmPassword": "password123"
  }
  ```
- **Success Response (201):**
  ```json
  {
    "success": true,
    "message": "User registered successfully",
    "data": {
      "userId": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
  }
  ```

#### 4. Login
- **Method:** `POST`
- **URL:** `http://localhost:5000/api/auth/login`
- **Headers:** `Content-Type: application/json`
- **Body (JSON):**
  ```json
  {
    "email": "john@example.com",
    "password": "password123"
  }
  ```
- **Success Response (200):**
  ```json
  {
    "success": true,
    "message": "Login successful",
    "data": {
      "userId": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
  }
  ```

---

### 🔒 Protected Endpoints (Requires Authentication)

#### 5. Get Profile
- **Method:** `GET`
- **URL:** `http://localhost:5000/api/profile`
- **Headers:** 
  - `Authorization: Bearer <your_token>`
- **Success Response (200):**
  ```json
  {
    "success": true,
    "message": "Profile endpoint (coming soon)",
    "data": {
      "userId": 1,
      "email": "john@example.com"
    }
  }
  ```

---

## 🔑 How to Use JWT Token in Postman

### Method 1: Using Environment Variable (Recommended)

1. **Login or Signup** first
2. Copy the `token` from the response
3. Click on **Environments** (top right)
4. Find `access_token` variable
5. Paste the token in the **Current Value** field
6. Now all protected routes will automatically use `{{access_token}}`

### Method 2: Manual Entry

1. Open any protected endpoint request
2. Go to **Headers** tab
3. Add:
   - **Key:** `Authorization`
   - **Value:** `Bearer <paste_your_token_here>`

---

## 📝 Testing Workflow

### Complete Test Sequence:

1. **Check Server Health**
   ```
   GET /api/health
   ```

2. **Register New User**
   ```
   POST /api/auth/signup
   Body: { name, email, password, confirmPassword }
   ```
   ✅ **Save the token from response**

3. **Login**
   ```
   POST /api/auth/login
   Body: { email, password }
   ```
   ✅ **Save the token from response**

4. **Access Protected Profile**
   ```
   GET /api/profile
   Header: Authorization: Bearer <token>
   ```

---

## ⚙️ Environment Variables

The environment includes:

| Variable | Value | Description |
|----------|-------|-------------|
| `base_url` | http://localhost:5000 | Base server URL |
| `api_url` | {{base_url}}/api | API base path |
| `access_token` | (empty) | JWT token - set after login |

---

## 🔍 Error Responses

### 400 - Bad Request
```json
{
  "success": false,
  "message": "Validation error message"
}
```

### 401 - Unauthorized
```json
{
  "success": false,
  "message": "Access token is required"
}
```

### 500 - Internal Server Error
```json
{
  "success": false,
  "message": "Internal server error"
}
```

---

## 🎯 Quick Tips

1. **Always start server first:** `node server.js` in backend_T folder
2. **Server must be running on:** http://localhost:5000
3. **Save tokens:** After login/signup, save the token to environment variable
4. **Token expiry:** Tokens expire after 7 days (default)
5. **Password requirements:** Minimum 6 characters

---

## 🛠️ Troubleshooting

### Can't connect to server?
- Check if backend server is running: `node server.js`
- Verify MySQL is running
- Check port 5000 is not blocked

### 401 Unauthorized on protected routes?
- Make sure you're logged in
- Copy token from login/signup response
- Add token to `access_token` environment variable
- Verify Authorization header format: `Bearer <token>`

### Database errors?
- Check MySQL is running
- Verify database credentials in `.env` file
- Ensure `travel_db` database exists
- Check `users` table is created

---

## 📚 Additional Resources

- Backend README: See `README.md` in backend_T folder
- Database Schema: See `database/schema.sql`
- Environment Config: See `.env.example`

---

**Happy Testing! 🚀**
