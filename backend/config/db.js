const mysql = require('mysql2/promise');
require('dotenv').config();

// First, connect without specifying database to create it if needed
const adminPool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Create database if it doesn't exist
async function createDatabaseIfNotExists() {
  const dbName = process.env.DB_NAME || 'todo_db';
  try {
    await adminPool.execute(`CREATE DATABASE IF NOT EXISTS \`${dbName}\``);
    console.log(`Database '${dbName}' is ready`);
  } catch (error) {
    console.error('Error creating database:', error.message);
  }
}

// Create connection pool with database
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'todo_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Initialize database and tables
async function initializeDatabase() {
  try {
    // First create the database
    await createDatabaseIfNotExists();
    
    // Then create tables
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        pin VARCHAR(4) NULL,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await pool.execute(`
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
      )
    `);

    console.log('Database tables initialized successfully');
    
    // Test connection
    const connection = await pool.getConnection();
    console.log('Connected to MySQL database');
    connection.release();
  } catch (error) {
    console.error('Error initializing database:', error.message);
  }
}

// Initialize on startup
initializeDatabase();

module.exports = pool;