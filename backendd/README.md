# Travel Application Backend API

Backend API for Travel Application built with Express.js, MySQL, and JWT authentication.

## 📁 Project Structure

```
backend_T/
├── src/
│   ├── config/
│   │   └── database.js          # MySQL connection configuration
│   ├── middleware/
│   │   └── auth.js              # JWT authentication middleware
│   ├── modules/
│   │   ├── auth/                # Authentication module
│   │   │   ├── auth.controller.js
│   │   │   ├── auth.service.js
│   │   │   └── auth.routes.js
│   │   └── profile/             # Profile module (placeholder)
│   │       └── profile.routes.js
│   ├── routes/
│   │   └── index.js             # Main router
│   ├── utils/
│   │   ├── jwt.js               # JWT utility functions
│   │   └── response.js          # Response helpers
│   └── app.js                   # Express app configuration
├── database/
│   └── schema.sql               # Database schema
├── .env.example                 # Environment variables template
├── .gitignore
├── package.json
└── server.js                    # Server entry point
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- MySQL (v8 or higher)

### Installation

1. **Install dependencies**
   ```bash
   cd backend_T
   npm install
   ```

2. **Setup MySQL database**
   - Create a MySQL database
   - Run the schema from `database/schema.sql`:
   ```bash
   mysql -u root -p < database/schema.sql
   ```
   Or manually create the database using MySQL Workbench or any MySQL client.

3. **Configure environment variables**
   - Copy `.env.example` to `.env`:
   ```bash
   copy .env.example .env
   ```
   - Update the `.env` file with your configuration:
   ```env
   PORT=5000
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_password
   DB_NAME=travel_db
   JWT_SECRET=your_secret_key
   ```

4. **Start the server**
   ```bash
   npm start
   ```
   Or for development with auto-restart:
   ```bash
   npm run dev
   ```

## 📡 API Endpoints

### Base URL
```
http://localhost:5000/api
```

### Authentication Endpoints

#### 1. Sign Up (Register)
- **URL:** `POST /api/auth/signup`
- **Body:**
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

#### 2. Login
- **URL:** `POST /api/auth/login`
- **Body:**
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

### Protected Endpoints (Require Authentication)

#### 3. Get Profile (Example)
- **URL:** `GET /api/profile`
- **Headers:**
  ```
  Authorization: Bearer <your_token>
  ```
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

### Health Check
- **URL:** `GET /api/health`
- **Response:**
  ```json
  {
    "success": true,
    "message": "Travel API is running",
    "timestamp": "2026-02-26T10:00:00.000Z"
  }
  ```

## 🔐 Authentication

The API uses JWT (JSON Web Tokens) for authentication:

1. **Sign up or log in** to receive a token
2. **Include the token** in the Authorization header for protected routes:
   ```
   Authorization: Bearer <your_token>
   ```
3. Tokens are valid for 7 days by default (configurable in `.env`)

## 🔧 Technologies Used

- **Express.js** - Web framework
- **MySQL2** - Database driver
- **bcryptjs** - Password hashing
- **jsonwebtoken** - JWT authentication
- **dotenv** - Environment variables
- **cors** - Cross-origin resource sharing

## 📝 Database Schema

### Users Table
```sql
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

## 🛠️ Future Implementation

The modular structure is ready for expansion:
- Profile management (Update profile, avatar upload)
- Flight bookings
- Hotel bookings
- Bus bookings
- Trip management
- Payment integration

## 📌 Notes

- Password must be at least 6 characters
- All passwords are hashed using bcrypt
- Email must be unique in the system
- Tokens expire after 7 days (default)

## 🐛 Error Handling

All errors follow this structure:
```json
{
  "success": false,
  "message": "Error message here"
}
```

Common status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `404` - Not Found
- `500` - Internal Server Error

## 👨‍💻 Development

The backend is designed with:
- **Modular architecture** - Each feature in its own module
- **Separation of concerns** - Controllers, services, and routes separated
- **Middleware** - Authentication and error handling
- **Utility functions** - JWT and response helpers
- **Environment configuration** - Easy deployment

---

**Happy Coding! ✈️🌍**
