# 🚀 Deploy Frontend to Netlify

Quick guide to deploy your frontend to Netlify.

## Option 1: Drag & Drop (Fastest - 2 minutes)

### Step 1: Prepare Files

Make sure your `frontend` folder has:

- ✅ `index.html`
- ✅ `script.js`
- ✅ `style.css`
- ✅ `config.js` (optional)
- ✅ Railway backend URL set in `index.html`

### Step 2: Deploy

1. **Go to Netlify**: https://app.netlify.com
2. **Sign up/Login** (use GitHub, Google, or email)
3. **Drag & Drop**:
   - Open File Explorer
   - Navigate to your `frontend` folder
   - Drag the entire `frontend` folder to Netlify's "Sites" page
4. **Done!** Netlify will give you a URL like: `https://random-name-123.netlify.app`

### Step 3: Test

1. Open your Netlify URL
2. Test adding a task
3. Verify it saves to Railway backend

---

## Option 2: GitHub Deploy (Recommended for Updates)

### Step 1: Push to GitHub

1. Make sure your code is on GitHub
2. If not, push it:
   ```bash
   git add .
   git commit -m "Ready for Netlify deployment"
   git push origin main
   ```

### Step 2: Connect to Netlify

1. Go to https://app.netlify.com
2. Click **"Add new site"** → **"Import an existing project"**
3. Click **"Deploy with GitHub"**
4. Authorize Netlify to access GitHub
5. Select your repository

### Step 3: Configure Build Settings

1. **Base directory**: `frontend`
   - Click "Show advanced"
   - Set Base directory to: `frontend`
2. **Build command**: Leave empty (no build needed)
3. **Publish directory**: `frontend` (or `.` if base directory is already `frontend`)
4. Click **"Deploy site"**

### Step 4: Get Your URL

1. Netlify will deploy automatically
2. You'll get a URL like: `https://your-app-name.netlify.app`
3. You can customize it in Site settings → Domain management

---

## Option 3: Netlify CLI (For Developers)

### Step 1: Install Netlify CLI

```bash
npm install -g netlify-cli
```

### Step 2: Login

```bash
netlify login
```

### Step 3: Deploy

```bash
cd frontend
netlify deploy --prod
```

Follow prompts to create new site or link existing one.

---

## ✅ After Deployment

### Test Your App

1. Open your Netlify URL
2. Check browser console (F12) - should show Railway API URL
3. Test:
   - Create account (PIN setup or skip)
   - Add a task
   - Edit a task
   - Delete a task
   - Verify tasks save to Railway database

### Custom Domain (Optional)

1. Go to Site settings → Domain management
2. Click "Add custom domain"
3. Follow instructions to add your domain

---

## 🔧 Troubleshooting

### Frontend can't connect to backend

- Verify `window.API_BASE_URL` is set in `index.html`
- Check Railway backend is running
- Check browser console for CORS errors
- Verify Railway `FRONTEND_URL` includes your Netlify URL

### Tasks not saving

- Check API URL in browser console
- Test Railway backend directly: `https://your-backend.railway.app/api/health`
- Check Railway backend logs

---

## 🎉 You're Done!

Your frontend is now live on Netlify and connected to your Railway backend!

**Share your app URL with others** - it's fully functional and accessible from anywhere!
