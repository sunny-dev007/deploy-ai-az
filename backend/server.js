const express = require('express');
const path = require('path');
const cors = require('cors');
const fs = require('fs');
require('dotenv').config(); // Load environment variables

const app = express();
// Use PORT from environment or 8080 for Azure compatibility
const PORT = process.env.PORT || 8080;

// Database connection - COMMENTED OUT FOR STATIC MODE
// serverName - feappserver
// DatabaseName -
// feserver_admin
// Password - 
/*
TODO: Uncomment when DB is available
const { poolPromise } = require('./db');
*/

// Print environment info for debugging
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('Current directory:', __dirname);
console.log('Parent directory:', path.join(__dirname, '../'));

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Test endpoint to verify backend is working
app.get('/api/test', (req, res) => {
  res.json({ 
    message: 'Backend is working in STATIC MODE!',
    env: process.env.NODE_ENV,
    currentDir: __dirname,
    parentDir: path.join(__dirname, '../'),
    mode: 'STATIC_MODE - DB disabled'
  });
});

// Add debug endpoint to list files in various directories
app.get('/api/debug', (req, res) => {
  const debugInfo = {};
  
  try {
    // Try to list files in various directories to help debug
    const dirs = [
      { name: 'Current directory', path: __dirname },
      { name: 'Parent directory', path: path.join(__dirname, '../') },
      { name: 'assets directory', path: path.join(__dirname, '../assets') },
      { name: 'assets/samplejson', path: path.join(__dirname, '../assets/samplejson') },
      { name: 'public/assets', path: path.join(__dirname, '../public/assets') },
      { name: 'samplejson', path: path.join(__dirname, '../public/assets/samplejson') }
    ];
    
    dirs.forEach(dir => {
      try {
        if (fs.existsSync(dir.path)) {
          debugInfo[dir.name] = fs.readdirSync(dir.path);
        } else {
          debugInfo[dir.name] = 'Directory does not exist';
        }
      } catch (err) {
        debugInfo[dir.name] = `Error: ${err.message}`;
      }
    });
    
    res.json({ debug: debugInfo });
  } catch (error) {
    res.status(500).json({ error: error.message, stack: error.stack });
  }
});

// Register API routes
app.use('/api', require('./routes/api'));

// Register Auth routes
app.use('/auth', require('./routes/auth'));

// In production, serve the frontend files
// React will be built into the build directory
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../')));
  
  // For any request that doesn't match an API or static file, send the React app
  app.get('*', (req, res) => {
    const indexPath = path.join(__dirname, '../index.html');
    console.log('Trying to serve index.html from:', indexPath);
    res.sendFile(indexPath);
  });
} else {
  // In development mode, just show a message for non-API routes
  app.get('*', (req, res) => {
    if (!req.path.startsWith('/api') && !req.path.startsWith('/auth')) {
      res.send('Backend server is running. Please access the frontend at http://localhost:3000');
    }
  });
}

// Database connection test - COMMENTED OUT FOR STATIC MODE
/*
TODO: Uncomment when DB is available
const { poolPromise } = require('./db');
poolPromise
  .then(() => {
    console.log("Successfully connected to the database");
  })
  .catch(err => {
    console.error("Database connection error:", err);
  });
*/
console.log("Database connection DISABLED - Running in STATIC MODE");

app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT} in STATIC MODE`);
  console.log(`Access your API at http://localhost:${PORT}/api/test`);
}); 