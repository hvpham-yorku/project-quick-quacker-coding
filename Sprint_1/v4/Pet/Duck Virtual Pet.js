// Game state
let gameState = {
    duckName: "Mr. Quackers",
    level: 1,
    xp: 0,
    xpToNextLevel: 100,
    hunger: 50, // Start with lower hunger so feeding is immediately visible
    thirst: 50, // Start with lower thirst so drinking is immediately visible
    mood: "happy",
    feedCount: 0,
    waterCount: 0,
    playCount: 0,
    lastFed: Date.now(),
    lastWatered: Date.now(),
    achievements: {
        reachedLevel2: false,
        fed10Times: false,
        watered10Times: false
    }
};

// Load game state from local storage if available
const savedState = localStorage.getItem('duckPetGame');
if (savedState) {
    try {
        const parsedState = JSON.parse(savedState);
        // Add a time check to reduce hunger/thirst since last play
        const now = Date.now();
        const hoursSinceLastFed = (now - parsedState.lastFed) / (1000 * 60 * 60);
        const hoursSinceLastWatered = (now - parsedState.lastWatered) / (1000 * 60 * 60);
        
        // Reduce hunger and thirst based on time elapsed
        parsedState.hunger = Math.max(0, parsedState.hunger - hoursSinceLastFed * 10);
        parsedState.thirst = Math.max(0, parsedState.thirst - hoursSinceLastWatered * 15);
        parsedState.lastFed = now;
        parsedState.lastWatered = now;
        
        // Update mood based on current hunger and thirst
        parsedState.mood = getMoodBasedOnStats(parsedState.hunger, parsedState.thirst);
        
        gameState = parsedState;
    } catch (e) {
        console.error("Error loading saved game:", e);
    }
}

// DOM Elements
const duckNameDisplay = document.getElementById('duckNameDisplay');
const levelDisplay = document.getElementById('levelDisplay');
const xpDisplay = document.getElementById('xpDisplay');
const xpBar = document.getElementById('xpBar');
const hungerBar = document.getElementById('hungerBar');
const thirstBar = document.getElementById('thirstBar');
const duck = document.getElementById('duck');
const duckHead = document.getElementById('duckHead');
const duckWing = document.getElementById('duckWing');
const food = document.getElementById('food');
const water = document.getElementById('water');
const levelUp = document.getElementById('levelUp');
const mood = document.getElementById('mood');
const egg = document.getElementById('egg');
const feedBtn = document.getElementById('feedBtn');
const waterBtn = document.getElementById('waterBtn');
const playBtn = document.getElementById('playBtn');
const gameArea = document.getElementById('gameArea');
const settingsBtn = document.querySelector('.settings');
const settingsModal = document.getElementById('settingsModal');
const closeModalBtn = document.getElementById('closeModal');
const duckNameInput = document.getElementById('duckName');
const saveSettingsBtn = document.getElementById('saveSettings');
const achievement1 = document.getElementById('achievement1');
const achievement2 = document.getElementById('achievement2');
const achievement3 = document.getElementById('achievement3');

// Initialize the game
updateUI();
showMood();

// Auto-save every minute
setInterval(saveGame, 60000);

// Auto-decrease hunger and thirst every 2 minutes
setInterval(() => {
    decreaseStats();
    updateUI();
}, 120000);

// Event Listeners
feedBtn.addEventListener('click', feedDuck);
waterBtn.addEventListener('click', giveDuckWater);
playBtn.addEventListener('click', playWithDuck);

settingsBtn.addEventListener('click', openSettings);
closeModalBtn.addEventListener('click', closeSettings);
saveSettingsBtn.addEventListener('click', saveSettings);

// Function to check achievements
function checkAchievements() {
    // Check level achievement
    if (gameState.level >= 2 && !gameState.achievements.reachedLevel2) {
        gameState.achievements.reachedLevel2 = true;
        achievement1.classList.add('unlocked');
    }
    
    // Check feeding achievement
    if (gameState.feedCount >= 10 && !gameState.achievements.fed10Times) {
        gameState.achievements.fed10Times = true;
        achievement2.classList.add('unlocked');
    }
    
    // Check watering achievement
    if (gameState.waterCount >= 10 && !gameState.achievements.watered10Times) {
        gameState.achievements.watered10Times = true;
        achievement3.classList.add('unlocked');
    }
}

// Occasionally make the duck do something on its own
setInterval(() => {
    if (Math.random() < 0.3) {
        const actions = [moveRandomly, flapWings, nodHead, layEgg];
        const randomAction = actions[Math.floor(Math.random() * actions.length)];
        randomAction();
    }
}, 8000);

// Functions
function feedDuck() {
    if (gameState.hunger >= 100) {
        showMood("I'm full!");
        return;
    }

    food.style.opacity = '1';
    food.style.transform = 'scale(1)';
    duck.style.left = '30%';

    setTimeout(() => {
        duckHead.style.animation = 'bounce 0.5s';
        food.style.opacity = '0';
        food.style.transform = 'scale(0.5)';

        gameState.hunger = Math.min(100, gameState.hunger + 20);
        gameState.feedCount++;

        addXP(15); // Add XP for feeding

        checkAchievements();
        updateUI(); // Update UI immediately to show hunger increase

        setTimeout(() => {
            duck.style.left = '50%';
            duckHead.style.animation = '';
            showMood("Yum!");
        }, 1000);
    }, 1000);

    gameState.lastFed = Date.now();
    saveGame();
}

function giveDuckWater() {
    if (gameState.thirst >= 100) {
        showMood("I'm not thirsty!");
        return;
    }

    water.style.opacity = '1';
    water.style.transform = 'scale(1)';
    duck.style.left = '70%';

    setTimeout(() => {
        duckHead.style.animation = 'bounce 0.5s';
        water.style.opacity = '0';
        water.style.transform = 'scale(0.5)';

        createRipple(70);

        gameState.thirst = Math.min(100, gameState.thirst + 25);
        gameState.waterCount++;

        addXP(10); // Add XP for drinking

        checkAchievements();
        updateUI(); // Update UI immediately to show thirst increase

        setTimeout(() => {
            duck.style.left = '50%';
            duckHead.style.animation = '';
            showMood("Refreshing!");
        }, 1000);
    }, 1000);

    gameState.lastWatered = Date.now();
    saveGame();
}

function playWithDuck() {
    // Randomly choose an action
    const actions = [moveRandomly, flapWings, nodHead];
    const randomAction = actions[Math.floor(Math.random() * actions.length)];
    randomAction();
    
    // Add XP
    addXP(5);
    
    // Update play count
    gameState.playCount++;
    
    // Update mood
    showMood("Whee! Fun!");
    
    // Update UI
    updateUI();
}

function addXP(amount) {
    gameState.xp += amount;
    
    // Check for level up
    if (gameState.xp >= gameState.xpToNextLevel) {
        levelUp.style.opacity = '1';
        levelUp.style.transform = 'translateX(-50%) translateY(-20px)';
        
        gameState.level++;
        gameState.xp = gameState.xp - gameState.xpToNextLevel;
        gameState.xpToNextLevel = Math.floor(gameState.xpToNextLevel * 1.5);
        
        // Check for achievements
        checkAchievements();
        
        setTimeout(() => {
            levelUp.style.opacity = '0';
            levelUp.style.transform = 'translateX(-50%)';
        }, 2000);
    }
    
    updateUI(); // Update UI to show XP changes
}

function decreaseStats() {
    gameState.hunger = Math.max(0, gameState.hunger - 5);
    gameState.thirst = Math.max(0, gameState.thirst - 8);
    
    // Update mood based on hunger and thirst
    gameState.mood = getMoodBasedOnStats(gameState.hunger, gameState.thirst);
    
    updateUI(); // Make sure UI updates when stats decrease
    saveGame();
}

function getMoodBasedOnStats(hunger, thirst) {
    if (hunger < 20 || thirst < 20) {
        return "unhappy";
    } else if (hunger < 50 || thirst < 50) {
        return "neutral";
    } else {
        return "happy";
    }
}

function showMood(text) {
    if (!text) {
        // Show mood based on current state
        if (gameState.mood === "happy") {
            mood.textContent = "Quack! I'm happy!";
        } else if (gameState.mood === "neutral") {
            mood.textContent = "I'm okay...";
        } else {
            if (gameState.hunger < 20) {
                mood.textContent = "I'm hungry!";
            } else if (gameState.thirst < 20) {
                mood.textContent = "I need water!";
            } else {
                mood.textContent = "Quack...";
            }
        }
    } else {
        mood.textContent = text;
    }
    
    mood.style.opacity = '1';
    
    setTimeout(() => {
        mood.style.opacity = '0';
    }, 3000);
}

function moveRandomly() {
    const randomLeft = 30 + Math.random() * 40; // 30% to 70%
    duck.style.left = `${randomLeft}%`;
    
    setTimeout(() => {
        duck.style.left = '50%';
    }, 2000);
}

function flapWings() {
    duckWing.style.animation = 'flap 0.3s infinite';
    
    setTimeout(() => {
        duckWing.style.animation = '';
    }, 1500);
}

function nodHead() {
    duckHead.style.animation = 'bounce 0.5s 3';
    
    setTimeout(() => {
        duckHead.style.animation = '';
    }, 1500);
}

function layEgg() {
    if (gameState.level >= 3 && Math.random() < 0.3) {
        egg.style.opacity = '1';
        
        setTimeout(() => {
            egg.style.opacity = '0';
            addXP(20);
            updateUI();
        }, 5000);
    }
}

function createRipple(positionPercent) {
    const ripple = document.createElement('div');
    ripple.className = 'ripple';
    
    ripple.style.left = `${positionPercent}%`;
    ripple.style.opacity = '1';
    
    gameArea.appendChild(ripple);
    
    // Use the Web Animations API for better compatibility
    let animation = ripple.animate([
        { width: '0', height: '0', opacity: 1 },
        { width: '50px', height: '50px', opacity: 0 }
    ], {
        duration: 2000,
        easing: 'ease-out'
    });
    
    animation.onfinish = () => {
        ripple.remove();
    };
}

function updateUI() {
    // Update text displays
    duckNameDisplay.textContent = gameState.duckName;
    levelDisplay.textContent = gameState.level;
    xpDisplay.textContent = `${Math.floor(gameState.xp)}/${gameState.xpToNextLevel}`;
    
    // Update progress bars - ensure they update immediately and show correct values
    xpBar.style.width = `${(gameState.xp / gameState.xpToNextLevel) * 100}%`;
    hungerBar.style.width = `${gameState.hunger}%`;
    thirstBar.style.width = `${gameState.thirst}%`;
    
    // Update duck appearance based on level
    if (gameState.level >= 3) {
        duck.style.transform = 'translateX(-50%) scale(1.2)';
    } else if (gameState.level >= 2) {
        duck.style.transform = 'translateX(-50%) scale(1.1)';
    }
    
    // Update achievements
    if (gameState.achievements.reachedLevel2) {
        achievement1.classList.add('unlocked');
    }
    if (gameState.achievements.fed10Times) {
        achievement2.classList.add('unlocked');
    }
    if (gameState.achievements.watered10Times) {
        achievement3.classList.add('unlocked');
    }
}

function openSettings() {
    settingsModal.style.display = 'flex';
    duckNameInput.value = gameState.duckName;
}

function closeSettings() {
    settingsModal.style.display = 'none';
}

function saveSettings() {
    const newName = duckNameInput.value.trim();
    if (newName) {
        gameState.duckName = newName;
        duckNameDisplay.textContent = newName;
        saveGame();
    }
    closeSettings();
}

function saveGame() {
    localStorage.setItem('duckPetGame', JSON.stringify(gameState));
}