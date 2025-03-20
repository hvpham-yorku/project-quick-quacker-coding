-- Create Users Table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Tasks Table
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

--Create Ducks Table
CREATE TABLE ducks (
    id SERIAL PRIMARY KEY,
    user_id INT UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    level INT DEFAULT 1,
    hunger INT DEFAULT 100, -- 100 is full, decreases over time
    thirst INT DEFAULT 100, -- 100 is full, decreases over time
    experience INT DEFAULT 0, -- Gained by completing tasks
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
