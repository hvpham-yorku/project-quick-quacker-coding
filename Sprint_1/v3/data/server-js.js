const express = require('express');
const session = require('express-session');
const bcrypt = require('bcrypt');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: 'quack-quack-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: { 
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    httpOnly: true
  }
}));

// Check if users.json exists, if not create it with a default admin user
const usersFilePath = path.join(__dirname, 'data', 'users.json');

function ensureUserFileExists() {
  const dataDir = path.join(__dirname, 'data');
  
  // Create data directory if it doesn't exist
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir);
  }
  
  // Create users.json with default admin if it doesn't exist
  if (!fs.existsSync(usersFilePath)) {
    const defaultAdmin = {
      username: 'admin',
      // Default password: "quackadmin"
      passwordHash: '$2b$10$Xt1YhzI5kT8HtM3qOQzL8OjGLNgYUQB7meFY3r5OvuqOz67cjNEhq',
      name: 'Admin User'
    };
    
    const users = { users: [defaultAdmin] };
    fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));
    console.log('Created default users file with admin user');
  }
}

ensureUserFileExists();

// Routes
app.get('/', (req, res) => {
  // If user is logged in, redirect to app, otherwise to login
  if (req.session.user) {
    res.sendFile(path.join(__dirname, 'public', 'duckhtml.html'));
  } else {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
  }
});

// Login API endpoint
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  
  try {
    // Read users from file
    const usersData = JSON.parse(fs.readFileSync(usersFilePath));
    const user = usersData.users.find(u => u.username === username);
    
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid username or password' });
    }
    
    // Compare passwords
    bcrypt.compare(password, user.passwordHash, (err, result) => {
      if (err) {
        console.error('Error comparing passwords:', err);
        return res.status(500).json({ success: false, message: 'Server error' });
      }
      
      if (result) {
        // Store user in session (excluding passwordHash)
        req.session.user = {
          username: user.username,
          name: user.name
        };
        
        return res.json({ success: true });
      } else {
        return res.status(401).json({ success: false, message: 'Invalid username or password' });
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Check if user is logged in
app.get('/api/check-auth', (req, res) => {
  if (req.session.user) {
    res.json({ loggedIn: true, user: req.session.user });
  } else {
    res.json({ loggedIn: false });
  }
});

// Logout endpoint
app.post('/api/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Logout failed' });
    }
    res.json({ success: true });
  });
});

// Add a new user (signup)
app.post('/api/signup', async (req, res) => {
  try {
    const { username, password, name } = req.body;
    
    // Basic validation
    if (!username || !password || !name) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }
    
    // Read current users
    const usersData = JSON.parse(fs.readFileSync(usersFilePath));
    
    // Check if username already exists
    if (usersData.users.some(user => user.username === username)) {
      return res.status(409).json({ success: false, message: 'Username already exists' });
    }
    
    // Hash password
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);
    
    // Add new user
    const newUser = {
      username,
      passwordHash,
      name
    };
    
    usersData.users.push(newUser);
    
    // Save updated users
    fs.writeFileSync(usersFilePath, JSON.stringify(usersData, null, 2));
    
    // Auto-login the new user
    req.session.user = {
      username,
      name
    };
    
    res.json({ success: true });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});