-- Manual table creation script for Railway MySQL
-- Run this if tables weren't created automatically

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  pin VARCHAR(4) NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create tasks table
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

