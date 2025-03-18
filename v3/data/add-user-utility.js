// Utility to add a new user from the command line
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const usersFilePath = path.join(__dirname, 'data', 'users.json');

// Make sure data directory exists
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir);
}

// Make sure users.json exists
if (!fs.existsSync(usersFilePath)) {
  fs.writeFileSync(usersFilePath, JSON.stringify({ users: [] }, null, 2));
}

// Ask for user details
rl.question('Enter username: ', (username) => {
  rl.question('Enter password: ', async (password) => {
    rl.question('Enter full name: ', async (name) => {
      try {
        // Hash password
        const saltRounds = 10;
        const passwordHash = await bcrypt.hash(password, saltRounds);
        
        // Read existing users
        const usersData = JSON.parse(fs.readFileSync(usersFilePath));
        
        // Check if username already exists
        if (usersData.users.some(user => user.username === username)) {
          console.log('Error: Username already exists');
          rl.close();
          return;
        }
        
        // Add new user
        const newUser = {
          username,
          passwordHash,
          name
        };
        
        usersData.users.push(newUser);
        
        // Save updated users
        fs.writeFileSync(usersFilePath, JSON.stringify(usersData, null, 2));
        
        console.log(`User '${username}' added successfully`);
      } catch (error) {
        console.error('Error adding user:', error);
      } finally {
        rl.close();
      }
    });
  });
});
