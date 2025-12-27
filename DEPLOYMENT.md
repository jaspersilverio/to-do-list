# Deployment Guide for To-Do List App

This guide will help you deploy the To-Do List app to various cloud platforms.

## 📋 Prerequisites

1. **Git** installed
2. **Node.js** (v14 or higher)
3. **MySQL Database** (local or cloud)
4. Account on deployment platform (Heroku, Railway, Render, etc.)

---

## 🗄️ Database Setup

### Option 1: Cloud MySQL (Recommended for Production)

**Services:**

- **PlanetScale** (Free tier available): https://planetscale.com
- **Railway MySQL**: Included with Railway deployment
- **Render PostgreSQL**: Can use PostgreSQL instead
- **AWS RDS**: For production
- **Google Cloud SQL**: For production

### Option 2: Local MySQL (For Testing)

Use your existing MySQL setup or Docker container.

---

## 🚀 Backend Deployment

### Option A: Deploy to Railway

1. **Create Railway Account**

   - Go to https://railway.app
   - Sign up with GitHub

2. **Create New Project**

   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Connect your repository

3. **Add MySQL Database**

   - Click "New" → "Database" → "MySQL"
   - Railway will provide connection details

4. **Configure Environment Variables**

   - Go to your service → Variables
   - Add these variables:
     ```
     DB_HOST=<railway-provided-host>
     DB_USER=<railway-provided-user>
     DB_PASSWORD=<railway-provided-password>
     DB_NAME=<railway-provided-database>
     PORT=3000
     FRONTEND_URL=*
     ```

5. **Deploy**
   - Railway will auto-deploy on push
   - Get your backend URL (e.g., `https://your-app.railway.app`)

### Option B: Deploy to Render

1. **Create Render Account**

   - Go to https://render.com
   - Sign up

2. **Create Web Service**

   - Click "New" → "Web Service"
   - Connect your GitHub repository
   - Select `backend` folder as root directory
   - Build command: `npm install`
   - Start command: `npm start`

3. **Add PostgreSQL Database** (or use external MySQL)

   - Click "New" → "PostgreSQL"
   - Note: You'll need to update code to use PostgreSQL or use external MySQL

4. **Configure Environment Variables**

   - Add all variables from `.env.example`

5. **Deploy**
   - Render will deploy automatically
   - Get your backend URL

### Option C: Deploy to Heroku

1. **Install Heroku CLI**

   ```bash
   npm install -g heroku
   ```

2. **Login to Heroku**

   ```bash
   heroku login
   ```

3. **Create Heroku App**

   ```bash
   cd backend
   heroku create your-app-name
   ```

4. **Add MySQL Database**

   ```bash
   heroku addons:create cleardb:ignite
   # Or use JawsDB
   heroku addons:create jawsdb:kitefin
   ```

5. **Set Environment Variables**

   ```bash
   heroku config:set DB_HOST=<host>
   heroku config:set DB_USER=<user>
   heroku config:set DB_PASSWORD=<password>
   heroku config:set DB_NAME=<database>
   heroku config:set FRONTEND_URL=*
   ```

6. **Deploy**
   ```bash
   git push heroku main
   ```

---

## 🌐 Frontend Deployment

### Option A: Deploy to Netlify

1. **Create Netlify Account**

   - Go to https://netlify.com
   - Sign up

2. **Deploy**

   - Drag and drop `frontend` folder to Netlify
   - Or connect GitHub repo

3. **Configure Environment Variable**
   - Go to Site settings → Environment variables
   - Add: `API_BASE_URL` = `https://your-backend-url.com/api`
   - Update `frontend/index.html` to include:
     ```html
     <script>
       window.API_BASE_URL = "https://your-backend-url.com/api";
     </script>
     <script src="script.js"></script>
     ```

### Option B: Deploy to Vercel

1. **Create Vercel Account**

   - Go to https://vercel.com
   - Sign up

2. **Deploy**

   - Import your repository
   - Set root directory to `frontend`
   - Deploy

3. **Configure API URL** (same as Netlify)

### Option C: Deploy to GitHub Pages

1. **Update frontend/script.js** to use your backend URL
2. **Push to GitHub**
3. **Enable GitHub Pages** in repository settings
4. **Select `frontend` folder** as source

---

## 🔧 Local Testing with ngrok (Before Cloud Deployment)

1. **Install ngrok**

   ```bash
   npm install -g ngrok
   # Or download from https://ngrok.com
   ```

2. **Start your backend**

   ```bash
   cd backend
   npm start
   ```

3. **Create ngrok tunnel**

   ```bash
   ngrok http 3000
   ```

4. **Update frontend API URL**

   - Copy the ngrok URL (e.g., `https://abc123.ngrok.io`)
   - Update `frontend/script.js`:
     ```javascript
     const API_BASE_URL = "https://abc123.ngrok.io/api";
     ```

5. **Test your app**
   - Open frontend in browser
   - Test all features

---

## ✅ Post-Deployment Checklist

- [ ] Backend is accessible (test `/api/health` endpoint)
- [ ] Database connection works
- [ ] CORS is configured correctly
- [ ] Frontend can connect to backend
- [ ] User registration works
- [ ] PIN login works
- [ ] Tasks can be created
- [ ] Tasks can be edited
- [ ] Tasks can be deleted
- [ ] Tasks are user-specific (multi-tenant)

---

## 🔒 Security Notes

1. **Production CORS**: Update `FRONTEND_URL` to your actual frontend domain
2. **Database**: Use strong passwords
3. **HTTPS**: Always use HTTPS in production
4. **Environment Variables**: Never commit `.env` files

---

## 🐛 Troubleshooting

### Backend won't start

- Check environment variables are set
- Verify database connection
- Check logs for errors

### Frontend can't connect to backend

- Verify CORS settings
- Check API URL is correct
- Ensure backend is running

### Database connection errors

- Verify database credentials
- Check database is accessible from deployment platform
- Ensure database exists

---

## 📞 Support

If you encounter issues:

1. Check deployment platform logs
2. Verify all environment variables
3. Test API endpoints directly
4. Check browser console for errors
