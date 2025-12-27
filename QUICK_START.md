# 🚀 Quick Start Guide

Get your To-Do List app running in 5 minutes!

## Step 1: Database Setup

### Option A: Use Existing MySQL
If you already have MySQL running (like your Docker container):
```bash
# Your MySQL is already running on port 3306
# Just make sure the database exists
docker exec -it to-do-list mysql -uroot -pjapjap -e "CREATE DATABASE IF NOT EXISTS todo_db;"
```

### Option B: Cloud Database (For Production)
- **PlanetScale**: https://planetscale.com (Free tier)
- **Railway**: Auto-creates MySQL with deployment
- **Render**: PostgreSQL option available

## Step 2: Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env
# Edit .env with your database credentials

# Start server
npm start
```

You should see:
```
Database 'todo_db' is ready
Database tables initialized successfully
Connected to MySQL database
Server is running on port 3000
```

## Step 3: Frontend Setup

```bash
cd frontend

# Start a local server (choose one method):

# Method 1: Python
python -m http.server 8000

# Method 2: Node.js (if you have http-server installed)
npx http-server -p 8000

# Method 3: VS Code Live Server
# Right-click index.html → "Open with Live Server"
```

Open browser: `http://localhost:8000`

## Step 4: Test the App

1. **First Time Setup**:
   - You'll see PIN setup modal
   - Enter a 4-digit PIN (or skip)
   - App will create your user account

2. **Add a Task**:
   - Enter task title
   - Fill in optional fields (category, due date, priority, etc.)
   - Click "Add Task"

3. **Verify in Database**:
   ```sql
   -- Connect to MySQL
   docker exec -it to-do-list mysql -uroot -pjapjap todo_db
   
   -- Check users
   SELECT * FROM users;
   
   -- Check tasks
   SELECT * FROM tasks;
   ```

## 🎉 You're Done!

Your app is now running locally. Tasks are saved to MySQL and will persist across page refreshes.

## Next Steps

- **Deploy to Cloud**: See [DEPLOYMENT.md](./DEPLOYMENT.md)
- **Test with ngrok**: See ngrok section in DEPLOYMENT.md
- **Customize**: Edit `frontend/style.css` for theme changes

## Troubleshooting

### Backend won't start
- Check `.env` file exists and has correct database credentials
- Verify MySQL is running: `docker ps`
- Check port 3000 is not in use

### Frontend can't connect
- Verify backend is running: Open `http://localhost:3000/api/health`
- Check browser console (F12) for errors
- Verify CORS is configured in backend

### Tasks not saving
- Check backend terminal for errors
- Verify database connection in backend logs
- Check browser console for API errors

---

**Need help?** Check the main [README.md](./README.md) or [DEPLOYMENT.md](./DEPLOYMENT.md)

