// Frontend Configuration
// This file allows you to configure the API endpoint for different environments

// IMPORTANT: For Railway production deployment:
// 1. Open index.html
// 2. Find the script section with API_BASE_URL
// 3. Uncomment and set: window.API_BASE_URL = 'https://your-railway-backend.up.railway.app/api';
// 4. Replace 'your-railway-backend' with your actual Railway app name

// For local development: Leave window.API_BASE_URL commented in index.html
// The app will automatically use http://localhost:3000/api

const CONFIG = {
  // API Base URL - Auto-detects based on environment
  // Priority: window.API_BASE_URL (from index.html) > auto-detection
  API_BASE_URL: window.API_BASE_URL || 
    (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' 
      ? 'http://localhost:3000/api'  // Local development
      : `${window.location.protocol}//${window.location.hostname}${window.location.port ? ':' + window.location.port : ''}/api`), // Same origin fallback
  
  // Storage keys
  USER_ID_KEY: 'todoUserId',
  PIN_STORAGE_KEY: 'todoPin',
  
  // App settings
  APP_NAME: 'To-Do List',
  VERSION: '1.0.0'
};

// Export for use in script.js
if (typeof window !== 'undefined') {
  window.APP_CONFIG = CONFIG;
}

