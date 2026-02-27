# 🚀 Deployment Guide

## Problem You're Facing
Your **frontend is deployed on Vercel** but your **backend is NOT deployed** anywhere. The backend code is just sitting in GitHub, not running. That's why you see "Unable to connect to server" - your production frontend is trying to connect to `localhost:5000` which doesn't exist on Vercel's servers.

---

## ✅ Solution: Deploy Backend Separately

### Option 1: Deploy Backend on Vercel (Recommended - Easiest)

#### Step 1: Deploy Backend to Vercel

1. **Go to**: https://vercel.com/dashboard
2. **Click**: "Add New" → "Project"
3. **Import**: Your GitHub repository (same one)
4. **Configure Project**:
   - **Root Directory**: Choose `backend_T` (IMPORTANT!)
   - **Framework Preset**: Other
   - **Build Command**: Leave empty
   - **Output Directory**: Leave empty
5. **Add Environment Variables** (Click "Environment Variables"):
   ```
   NODE_ENV=production
   JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_random
   JWT_EXPIRES_IN=7d
   FRONTEND_URL=https://your-frontend-url.vercel.app
   
   # Database - Use online MySQL service
   DB_HOST=your_database_host
   DB_USER=your_database_user
   DB_PASSWORD=your_database_password
   DB_NAME=travel_db
   DB_PORT=3306
   ```
6. **Click**: "Deploy"

7. **Copy your backend URL** (will be something like `https://your-backend-abc123.vercel.app`)

#### Step 2: Setup Database (Online)

Since Vercel is serverless, you need an **online MySQL database**:

**Free Options:**
- **Aiven** (https://aiven.io) - Free tier available
- **PlanetScale** (https://planetscale.com) - Free tier available
- **Railway** (https://railway.app) - $5 credit free

**Steps:**
1. Sign up for one of these services
2. Create a MySQL database
3. Get connection details (host, user, password, database name)
4. Add these to your Vercel backend environment variables
5. Run your database schema (upload schema.sql)

#### Step 3: Update Frontend Environment Variables

1. **In Vercel Dashboard** (your frontend project):
   - Go to Project Settings → Environment Variables
   - Add:
     ```
     VITE_API_BASE_URL=https://your-backend-abc123.vercel.app/api
     ```
   - Replace with your actual backend URL from Step 1
2. **Redeploy** your frontend (automatic on next push)

#### Step 4: Update Local `.env.production` File

Edit `vite-project/.env.production`:
```env
VITE_API_BASE_URL=https://your-backend-abc123.vercel.app/api
```

#### Step 5: Push Changes
```bash
git add .
git commit -m "Add deployment configuration"
git push origin main
```

Your frontend will auto-redeploy with the new backend URL!

---

### Option 2: Deploy Backend on Render.com (Alternative)

1. **Go to**: https://render.com
2. **Sign up/Login**
3. **New Web Service** → Connect GitHub repo
4. **Configure**:
   - **Root Directory**: `backend_T`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Environment**: Node
5. **Add Environment Variables** (same as above)
6. **Deploy**
7. Follow Steps 3-5 from Option 1

---

### Option 3: Deploy Backend on Railway.app

1. **Go to**: https://railway.app
2. **New Project** → Deploy from GitHub
3. **Select** your repository
4. **Add** `backend_T` as service (specify root directory)
5. **Add Environment Variables**
6. Railway will provide a URL
7. Follow Steps 3-5 from Option 1

---

## 📝 Summary of What You Need

### For Local Development:
✅ Already set up! Use:
- Frontend: `http://localhost:5173`
- Backend: `http://localhost:5000`

### For Production:
1. ✅ Frontend on Vercel (you have this)
2. ❌ Backend needs deployment (choose option above)
3. ❌ Database needs cloud hosting (use Aiven/PlanetScale)
4. ❌ Update frontend env variables with backend URL

---

## 🔍 How to Check If It's Working

After deployment:
1. Visit your backend URL directly: `https://your-backend-url.vercel.app`
   - Should see: `{"success": true, "message": "Welcome to Travel API", ...}`
2. Visit: `https://your-backend-url.vercel.app/api/health`
   - Should see: `{"success": true, "message": "API is running"}`
3. Visit your frontend: `https://your-frontend-url.vercel.app`
   - Try signing up/logging in
   - Should work now! ✅

---

## ⚠️ Important Notes

1. **Never commit `.env` files** - They're in `.gitignore`
2. **Set environment variables in Vercel dashboard** - Not in files
3. **Use strong JWT_SECRET in production** - Generate random string
4. **Database must be online** - localhost won't work in production
5. **CORS is already configured** - Using `FRONTEND_URL` environment variable

---

## 🐛 Troubleshooting

### Still seeing "Unable to connect"?
- ✅ Check backend is deployed and accessible
- ✅ Check frontend has correct `VITE_API_BASE_URL` in Vercel
- ✅ Check CORS allows your frontend URL
- ✅ Check database connection in backend logs

### Backend deployment failing?
- ✅ Make sure `vercel.json` is in `backend_T` folder
- ✅ Make sure all environment variables are set
- ✅ Check Vercel logs for errors

---

## 📞 Quick Start (Right Now!)

1. **Deploy backend to Vercel** (5 minutes)
2. **Sign up for free database** (5 minutes)
3. **Update environment variables** (2 minutes)
4. **Test** (1 minute)

Total time: ~15 minutes to fix! 🎉
