# Duck Virtual Pet - Documentation

## 1. Overview
The **Duck Virtual Pet** project is a web-based interactive virtual pet and organizer that allows users to:
- Take care of a duck pet (feed, give water, play, and level up).
- Earn rewards by completing tasks (via the to-do list).
- Use an interactive calendar for scheduling.
- Login/Register users for personalization.


## 2. Installation & Setup

### Frontend Setup
1. Open `[Duck Homepage.html](https://hvpham-yorku.github.io/project-quick-quacker-coding/
)` in a browser.
2. Ensure **Duck Virtual Pet.js** and **Duck Homepage.js** are correctly linked.

### Backend Setup
1. Install dependencies in the backend folder:
   ```sh
   npm install
   ```
2. Start the backend:
   ```sh
   npm start
   ```
3. Ensure PostgreSQL is running:
   ```sh
   pg_ctl -D /usr/local/var/postgres start
   ```
4. Connect to the database and check tables:
   ```sql
   SELECT * FROM users;
   SELECT * FROM tasks;
   ```

## 3. Features & Functionality

### Virtual Pet System
- Feed, Give Water, Play with Duck: Earn XP and level up.
- Duck Animations: Duck moves, flaps wings, and reacts.
- Achievements: Earn rewards for taking care of the pet.
- Settings: Change the duck’s name.

### Task Management System
- Add, Complete, Delete Tasks (to-do list functionality).
- Earn Rewards: Completing tasks gives food & water for the duck.

### Calendar & Organizer
- View and navigate months.
- Select specific dates to view tasks/events.

### User Authentication 
- Register & Login with secure passwords.
- JWT-based authentication for protecting user data.


## 4. Database Schema
### Users Table
```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```
### Tasks Table
```sql
CREATE TABLE tasks (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(50) DEFAULT 'pending',
    priority VARCHAR(50) DEFAULT 'medium',
    due_date DATE,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 5. Future Enhancements
- Profile Customization (change duck appearance, add themes)
- Cloud Storage for Game Progres
