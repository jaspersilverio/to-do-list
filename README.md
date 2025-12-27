# 📝 To-Do List App

A beautiful, feature-rich To-Do List application with multi-user support, PIN authentication, and cloud deployment ready.

## ✨ Features

- ✅ **Multi-User Support**: Each user has their own tasks (multi-tenant)
- 🔒 **PIN Authentication**: Optional 4-digit PIN protection
- 📱 **Mobile Responsive**: Works on all devices
- 🎨 **Beautiful UI**: Modern glow theme with smooth animations
- 📋 **Rich Task Management**:
  - Add, edit, delete tasks
  - Mark tasks as complete
  - Set due dates and times
  - Add notes and categories
  - Set priority levels (Low, Medium, High)
  - Set reminders
- ☁️ **Cloud Ready**: Deploy to Heroku, Railway, Render, etc.
- 🔄 **Real-time Sync**: Tasks sync across devices via backend API

## 🏗️ Architecture

### Backend (Node.js + Express + MySQL)
- RESTful API endpoints
- MySQL database with multi-tenant design
- User authentication via PIN
- Task CRUD operations

### Frontend (HTML/CSS/JavaScript)
- Vanilla JavaScript (no frameworks)
- Responsive design
- Local storage for user session
- API integration

## 🚀 Quick Start

### Prerequisites
- Node.js (v14+)
- MySQL (local or cloud)
- Git

### 1. Clone Repository
```bash
git clone <your-repo-url>
cd To-do-list
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create `.env` file:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=todo_db
PORT=3000
FRONTEND_URL=*
```

Start backend:
```bash
npm start
```

### 3. Frontend Setup

```bash
cd frontend
```

Start a local server (choose one):
```bash
# Python
python -m http.server 8000

# Node.js
npx http-server -p 8000

# PHP
php -S localhost:8000
```

Open browser: `http://localhost:8000`

## 📡 API Endpoints

### Authentication
- `POST /api/register` - Create user (with optional PIN)
- `POST /api/login` - Verify PIN and login

### Tasks
- `GET /api/tasks/:userId` - Get all tasks for user
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/:taskId` - Update task
- `DELETE /api/tasks/:taskId` - Delete task

### Health
- `GET /api/health` - Server health check

## 🗄️ Database Schema

### Users Table
```sql
id INT PRIMARY KEY AUTO_INCREMENT
pin VARCHAR(4) NULL
createdAt TIMESTAMP
```

### Tasks Table
```sql
id INT PRIMARY KEY AUTO_INCREMENT
userId INT NOT NULL (Foreign Key)
title VARCHAR(255) NOT NULL
notes TEXT
category VARCHAR(100)
dueDate DATE
dueTime TIME
priority ENUM('Low', 'Medium', 'High')
reminderTime DATETIME
completed BOOLEAN DEFAULT FALSE
createdAt TIMESTAMP
```

## ☁️ Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

### Quick Deploy Options:
- **Railway**: Auto-deploy from GitHub
- **Render**: Free tier available
- **Heroku**: Classic platform
- **Netlify/Vercel**: For frontend

## 🔧 Configuration

### Backend Environment Variables
- `DB_HOST` - Database host
- `DB_USER` - Database user
- `DB_PASSWORD` - Database password
- `DB_NAME` - Database name
- `PORT` - Server port (default: 3000)
- `FRONTEND_URL` - Frontend URL for CORS

### Frontend Configuration
Update `frontend/config.js` or set `window.API_BASE_URL` before loading script.js

## 🛠️ Development

### Project Structure
```
To-do-list/
├── backend/
│   ├── config/
│   │   └── db.js          # Database configuration
│   ├── controllers/
│   │   ├── authController.js
│   │   └── taskController.js
│   ├── models/
│   │   ├── User.js
│   │   └── Task.js
│   ├── routes/
│   │   ├── auth.js
│   │   └── tasks.js
│   ├── server.js
│   └── package.json
├── frontend/
│   ├── index.html
│   ├── script.js
│   ├── style.css
│   └── config.js
└── DEPLOYMENT.md
```

## 🔒 Security Features

- Multi-tenant isolation (users only see their tasks)
- PIN-based authentication
- CORS protection
- Input validation
- SQL injection protection (parameterized queries)

## 📱 Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

ISC License

## 🙏 Acknowledgments

Built with:
- Node.js & Express
- MySQL
- Vanilla JavaScript
- Modern CSS

---

**Ready to deploy?** Check out [DEPLOYMENT.md](./DEPLOYMENT.md) for step-by-step instructions!

