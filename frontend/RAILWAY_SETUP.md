# 🚂 Frontend Setup for Railway Backend

This guide shows you how to connect the frontend to your deployed Railway backend.

## 🔧 Quick Setup

### Step 1: Get Your Railway Backend URL

1. Go to your Railway dashboard
2. Click on your backend service
3. Go to **Settings** → **Domains**
4. Copy your Railway URL (e.g., `https://your-app.up.railway.app`)

### Step 2: Update Frontend Configuration

1. Open `frontend/index.html`
2. Find this section (around line 157):
   ```html
   <script>
       // window.API_BASE_URL = 'https://your-railway-backend.up.railway.app/api';
   </script>
   ```
3. Uncomment and update with your Railway URL:
   ```html
   <script>
       window.API_BASE_URL = 'https://your-app.up.railway.app/api';
   </script>
   ```
   **Important**: Replace `your-app` with your actual Railway app name!

### Step 3: Test

1. Open `frontend/index.html` in your browser
2. Open browser console (F12)
3. You should see: `API Base URL: https://your-app.up.railway.app/api`
4. Try adding a task - it should work!

## 🔄 Switching Between Local and Production

### For Local Development:
- **Comment out** the `window.API_BASE_URL` line in `index.html`
- The app will automatically use `http://localhost:3000/api`

### For Production (Railway):
- **Uncomment** and set `window.API_BASE_URL` to your Railway URL
- The app will use your Railway backend

## ✅ Verification

After setting up:

1. **Check Console**: Should show your Railway URL
2. **Test Registration**: Create a new user
3. **Test Tasks**: Add, edit, delete tasks
4. **Test Multi-User**: Each user should only see their own tasks

## 🐛 Troubleshooting

### Frontend can't connect to backend
- Verify Railway URL is correct (check for typos)
- Make sure URL ends with `/api` (not just the domain)
- Check Railway backend is running (test `/api/health` endpoint)
- Check browser console for CORS errors

### Tasks not saving
- Verify API URL in browser console
- Check Railway backend logs
- Test backend directly: `https://your-app.up.railway.app/api/health`

### CORS errors
- Make sure `FRONTEND_URL` is set in Railway environment variables
- For testing, you can set `FRONTEND_URL=*` in Railway

---

**That's it!** Your frontend is now connected to Railway. 🎉

