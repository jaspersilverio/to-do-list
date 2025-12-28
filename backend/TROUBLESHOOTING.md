# 🔧 Troubleshooting Guide

## Database Tables Not Created

### Why Tables Don't Exist

Tables are created **automatically** when your backend starts. If tables don't exist, it means:

1. **Backend hasn't started yet** - Most common reason
2. **Backend failed to connect to database** - Check environment variables
3. **Initialization failed silently** - Check backend logs

### Solution 1: Check Backend Logs (Recommended)

1. Go to Railway dashboard
2. Click on your **backend service** (not MySQL)
3. Click **"Deployments"** or **"Logs"** tab
4. Look for these messages:
   ```
   Database 'xxx' is ready
   Database tables initialized successfully
   Connected to MySQL database
   Server is running on port XXXX
   ```

**If you see these messages**: Tables should exist! The Railway UI might just not be showing them.

**If you DON'T see these messages**: Backend isn't running or failed to start.

### Solution 2: Verify Environment Variables

1. Go to your **backend service** in Railway
2. Click **"Variables"** tab
3. Verify you have:
   ```
   DB_HOST=${{MySQL.MYSQLHOST}}
   DB_USER=${{MySQL.MYSQLUSER}}
   DB_PASSWORD=${{MySQL.MYSQLPASSWORD}}
   DB_NAME=${{MySQL.MYSQLDATABASE}}
   ```

**Important**: Replace `MySQL` with your actual database service name if different.

### Solution 3: Manually Create Tables

If backend isn't creating tables, you can create them manually:

#### Option A: Using Railway CLI

1. Install Railway CLI:

   ```bash
   npm install -g @railway/cli
   ```

2. Login:

   ```bash
   railway login
   ```

3. Connect to database:

   ```bash
   railway connect
   ```

4. Run SQL:

   ```sql
   CREATE TABLE IF NOT EXISTS users (
     id INT AUTO_INCREMENT PRIMARY KEY,
     pin VARCHAR(4) NULL,
     createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   );

   CREATE TABLE IF NOT EXISTS tasks (
     id INT AUTO_INCREMENT PRIMARY KEY,
     userId INT NOT NULL,
     title VARCHAR(255) NOT NULL,
     notes TEXT NULL,
     category VARCHAR(100) NULL,
     dueDate DATE NULL,
     dueTime TIME NULL,
     createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
     completed BOOLEAN DEFAULT FALSE,
     priority ENUM('Low', 'Medium', 'High') NULL,
     reminderTime DATETIME NULL,
     FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
   );
   ```

#### Option B: Using MySQL Workbench

1. Get database credentials from Railway:

   - Go to MySQL service → Variables tab
   - Copy: `MYSQLHOST`, `MYSQLUSER`, `MYSQLPASSWORD`, `MYSQLDATABASE`, `MYSQLPORT`

2. Connect MySQL Workbench:

   - Host: `MYSQLHOST`
   - Port: `MYSQLPORT`
   - User: `MYSQLUSER`
   - Password: `MYSQLPASSWORD`
   - Database: `MYSQLDATABASE`

3. Run the SQL from `backend/scripts/create-tables.sql`

### Solution 4: Force Backend Restart

1. Go to Railway dashboard
2. Click on your backend service
3. Click **"Settings"** → **"Redeploy"**
4. Watch the logs to see if tables are created

## Common Issues

### Backend Won't Start

**Check:**

- Environment variables are set
- Root directory is set to `backend`
- `package.json` has `start` script
- Check deployment logs for errors

### Database Connection Errors

**Check:**

- Environment variables reference correct database service
- Database service is running (green status)
- Variables use correct syntax: `${{ServiceName.VARIABLE}}`

### Tables Still Don't Exist After Backend Starts

**Try:**

1. Check backend logs for initialization errors
2. Manually create tables (Solution 3)
3. Verify database name is correct
4. Check if foreign key constraints are causing issues

## Quick Test

Test if your backend can connect:

```bash
curl https://your-app.up.railway.app/api/health
```

If this works, backend is running. Then test database:

```bash
curl -X POST https://your-app.up.railway.app/api/register \
  -H "Content-Type: application/json" \
  -d '{}'
```

If this creates a user, database is working and tables exist!

---

**Need more help?** Check Railway deployment logs for specific error messages.
