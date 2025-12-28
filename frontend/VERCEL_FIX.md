# 🔧 Fix Vercel React Errors

If you're seeing React errors in Vercel console, it means Vercel is trying to build your static site as a React app.

## Quick Fix

### Step 1: Update Vercel Project Settings

1. Go to https://vercel.com/dashboard
2. Click your project (`todo-frontend`)
3. Go to **Settings** → **General**
4. Scroll to **"Framework Preset"**
5. Change it to **"Other"** (NOT React, NOT Next.js)
6. **Save** changes

### Step 2: Redeploy

1. Go to **Deployments** tab
2. Click the **three dots** (⋮) on the latest deployment
3. Click **"Redeploy"**
4. Wait for deployment to complete

### Step 3: Test

1. Open your Vercel URL
2. Open browser console (F12)
3. React errors should be gone
4. You should see: `API Base URL: https://sparkling-delight-production-2827.up.railway.app/api`

---

## Alternative: Delete & Re-import (if above doesn't work)

1. Go to **Settings** → **General**
2. Scroll down and click **"Delete Project"**
3. Go back to dashboard
4. Click **"Add New..."** → **"Project"**
5. Import your repository
6. Configure:
   - **Framework Preset**: **Other** ⚠️ IMPORTANT
   - **Root Directory**: `frontend`
   - **Build Command**: (leave empty)
   - **Output Directory**: `.`
   - **Install Command**: (leave empty)
7. Click **"Deploy"**

---

## Why This Happens

Vercel automatically detects frameworks. If you have a `package.json` in the root or if Vercel detects React-like code, it tries to build it as a React app. Since your frontend is plain HTML/CSS/JS (no build step needed), you need to explicitly tell Vercel to use "Other" framework preset.

