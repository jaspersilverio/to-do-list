# ⚡ Deploy Frontend to Vercel

Quick guide to deploy your frontend to Vercel.

## Step 1: Push to GitHub

1. Make sure your code is on GitHub
2. If not, push it:
   ```bash
   git add .
   git commit -m "Ready for Vercel deployment"
   git push origin main
   ```

## Step 2: Deploy to Vercel

1. **Go to Vercel**: https://vercel.com
2. **Sign up/Login** (use GitHub)
3. **Import Project**:
   - Click "Add New..." → "Project"
   - Select your GitHub repository
   - Click "Import"

## Step 3: Configure Project

1. **Framework Preset**: **Other** (IMPORTANT: Select "Other", not React/Next.js)
2. **Root Directory**: `frontend`
   - Click "Edit"
   - Change root directory to `frontend`
3. **Build Command**: Leave empty (no build needed)
4. **Output Directory**: `.` (current directory)
5. **Install Command**: Leave empty

**Important**: Make sure Framework Preset is set to "Other" - this prevents Vercel from trying to build it as a React/Next.js app!

## Step 4: Deploy

1. Click **"Deploy"**
2. Wait for deployment (usually 30-60 seconds)
3. You'll get a URL like: `https://your-app.vercel.app`

## Step 5: Test

1. Open your Vercel URL
2. Test your app - should work with Railway backend!

## ✅ Done!

Your frontend is now live on Vercel!

---

**Note**: You can customize your domain in Project Settings → Domains
