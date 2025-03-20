const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const path = require('path');

const app = express();
const port = 3000;

// PostgreSQL connection
const pool = new Pool({
  user: 'postgres',        // Change if you used a different username
  host: 'localhost',
  database: 'duck_pet',
  password: 'password',    // Replace with your actual password
  port: 5432,
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../')));

// Helper function to initialize user data
async function initializeUserData(username) {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    // Check if user exists, create if not
    const userRes = await client.query(
      'INSERT INTO users (username) VALUES ($1) ON CONFLICT (username) DO UPDATE SET username = $1 RETURNING id',
      [username]
    );
    const userId = userRes.rows[0].id;
    
    // Check if duck exists for this user
    let duckRes = await client.query(
      'SELECT id FROM ducks WHERE user_id = $1',
      [userId]
    );
    
    // If no duck exists, create one
    if (duckRes.rows.length === 0) {
      duckRes = await client.query(
        'INSERT INTO ducks (user_id) VALUES ($1) RETURNING id',
        [userId]
      );
      
      // Create achievements record
      await client.query(
        'INSERT INTO achievements (duck_id) VALUES ($1)',
        [duckRes.rows[0].id]
      );
    }
    
    // Check if rewards exist for this user
    const rewardsRes = await client.query(
      'SELECT id FROM rewards WHERE user_id = $1',
      [userId]
    );
    
    // If no rewards exist, create them
    if (rewardsRes.rows.length === 0) {
      await client.query(
        'INSERT INTO rewards (user_id) VALUES ($1)',
        [userId]
      );
    }
    
    await client.query('COMMIT');
    return userId;
  } catch (e) {
    await client.query('ROLLBACK');
    throw e;
  } finally {
    client.release();
  }
}

// Routes

// Get game state
app.get('/api/gamestate/:username', async (req, res) => {
  try {
    const username = req.params.username;
    const userId = await initializeUserData(username);
    
    // Get duck data
    const duckRes = await pool.query(
      'SELECT * FROM ducks WHERE user_id = $1',
      [userId]
    );
    
    // Get achievements
    const achievementsRes = await pool.query(
      'SELECT * FROM achievements WHERE duck_id = $1',
      [duckRes.rows[0].id]
    );
    
    // Get rewards
    const rewardsRes = await pool.query(
      'SELECT * FROM rewards WHERE user_id = $1',
      [userId]
    );
    
    // Format the response to match the expected structure
    const gameState = {
      duckName: duckRes.rows[0].name,
      level: duckRes.rows[0].level,
      xp: duckRes.rows[0].xp,
      xpToNextLevel: duckRes.rows[0].xp_to_next_level,
      mood: duckRes.rows[0].mood,
      feedCount: duckRes.rows[0].feed_count,
      waterCount: duckRes.rows[0].water_count,
      playCount: duckRes.rows[0].play_count,
      lastInteraction: new Date(duckRes.rows[0].last_interaction).getTime(),
      achievements: {
        reachedLevel2: achievementsRes.rows[0].reached_level_2,
        fed10Times: achievementsRes.rows[0].fed_10_times,
        watered10Times: achievementsRes.rows[0].watered_10_times,
        playedWithDuck20Times: achievementsRes.rows[0].played_with_duck_20_times,
        reachedLevel5: achievementsRes.rows[0].reached_level_5
      }
    };
    
    const duckRewards = {
      feedCount: rewardsRes.rows[0].feed_count,
      drinkCount: rewardsRes.rows[0].drink_count
    };
    
    res.json({
      gameState,
      duckRewards
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Save game state
app.post('/api/gamestate/:username', async (req, res) => {
  try {
    const username = req.params.username;
    const { gameState, duckRewards } = req.body;
    
    const userId = await initializeUserData(username);
    
    // Get duck ID
    const duckRes = await pool.query(
      'SELECT id FROM ducks WHERE user_id = $1',
      [userId]
    );
    const duckId = duckRes.rows[0].id;
    
    // Update duck data
    await pool.query(
      `UPDATE ducks 
       SET name = $1, level = $2, xp = $3, xp_to_next_level = $4, 
           mood = $5, feed_count = $6, water_count = $7, play_count = $8, 
           last_interaction = to_timestamp($9 / 1000.0)
       WHERE id = $10`,
      [
        gameState.duckName,
        gameState.level,
        gameState.xp,
        gameState.xpToNextLevel,
        gameState.mood,
        gameState.feedCount,
        gameState.waterCount,
        gameState.playCount,
        gameState.lastInteraction,
        duckId
      ]
    );
    
    // Update achievements
    await pool.query(
      `UPDATE achievements 
       SET reached_level_2 = $1, fed_10_times = $2, watered_10_times = $3, 
           played_with_duck_20_times = $4, reached_level_5 = $5
       WHERE duck_id = $6`,
      [
        gameState.achievements.reachedLevel2,
        gameState.achievements.fed10Times,
        gameState.achievements.watered10Times,
        gameState.achievements.playedWithDuck20Times,
        gameState.achievements.reachedLevel5,
        duckId
      ]
    );
    
    // Update rewards
    await pool.query(
      `UPDATE rewards 
       SET feed_count = $1, drink_count = $2
       WHERE user_id = $3`,
      [
        duckRewards.feedCount,
        duckRewards.drinkCount,
        userId
      ]
    );
    
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Add rewards (from completing tasks)
app.post('/api/rewards/:username', async (req, res) => {
  try {
    const username = req.params.username;
    const { feedCount, drinkCount } = req.body;
    
    const userId = await initializeUserData(username);
    
    // Update rewards
    await pool.query(
      `UPDATE rewards 
       SET feed_count = feed_count + $1, drink_count = drink_count + $2
       WHERE user_id = $3`,
      [feedCount, drinkCount, userId]
    );
    
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
