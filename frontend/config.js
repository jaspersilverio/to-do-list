// Frontend Configuration
// This file allows you to configure the API endpoint for different environments

// For local development, this will use localhost
// For production, set window.API_BASE_URL before loading script.js
// Or update this file with your production API URL

const CONFIG = {
  // API Base URL - Auto-detects based on environment
  API_BASE_URL: window.API_BASE_URL || 
    (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' 
      ? 'http://localhost:3000/api' 
      : `${window.location.protocol}//${window.location.hostname}${window.location.port ? ':' + window.location.port : ''}/api`),
  
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

