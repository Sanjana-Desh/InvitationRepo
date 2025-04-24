// Game logic
const gameArea = document.getElementById('gameArea');
const character = document.getElementById('character');
const scoreElement = document.getElementById('score');
const livesElement = document.getElementById('lives');
const timerElement = document.getElementById('timer');
const startGameBtn = document.getElementById('startGameBtn');
const gameContainer = document.getElementById('gameContainer');
const invitationContainer = document.getElementById('invitationContainer');

let score = 0;
let lives = 3;
let timeRemaining = 60;
let targets = [];
let obstacles = [];
let gameActive = false;
let characterPos = { x: 10, y: 10 };
let moveSpeed = 3; // Reduced speed to make game harder
let keys = {};
let gameInterval;
let targetInterval;
let obstacleInterval;
let timerInterval;

// Set character initial position
character.style.left = characterPos.x + 'px';
character.style.top = characterPos.y + 'px';

// Create target function with movement
function createTarget() {
    if (!gameActive) return;
    
    const target = document.createElement('div');
    target.classList.add('target');
    
    const posX = Math.random() * (gameArea.offsetWidth - 30);
    const posY = Math.random() * (gameArea.offsetHeight - 30);
    
    target.style.left = posX + 'px';
    target.style.top = posY + 'px';
    
    // Add random direction and speed for movement
    target.dataset.speedX = (Math.random() * 4 - 2); // -2 to 2
    target.dataset.speedY = (Math.random() * 4 - 2); // -2 to 2
    
    gameArea.appendChild(target);
    targets.push(target);
    
    // Remove target after shorter time if not collected
    setTimeout(() => {
        if (targets.includes(target)) {
            target.remove();
            targets = targets.filter(t => t !== target);
        }
    }, 1500); // Reduced from 3000ms to 1500ms
}

// Create obstacle function
function createObstacle() {
    if (!gameActive) return;
    
    const obstacle = document.createElement('div');
    obstacle.classList.add('obstacle');
    
    // Make sure obstacle doesn't spawn on character
    let posX, posY;
    do {
        posX = Math.random() * (gameArea.offsetWidth - 40);
        posY = Math.random() * (gameArea.offsetHeight - 40);
    } while (
        posX > characterPos.x - 70 && 
        posX < characterPos.x + 70 && 
        posY > characterPos.y - 70 && 
        posY < characterPos.y + 70
    );
    
    obstacle.style.left = posX + 'px';
    obstacle.style.top = posY + 'px';
    
    // Add random direction and speed for movement
    obstacle.dataset.speedX = (Math.random() * 2 - 1); // -1 to 1
    obstacle.dataset.speedY = (Math.random() * 2 - 1); // -1 to 1
    
    gameArea.appendChild(obstacle);
    obstacles.push(obstacle);
    
    // Remove obstacle after some time
    setTimeout(() => {
        if (obstacles.includes(obstacle)) {
            obstacle.remove();
            obstacles = obstacles.filter(o => o !== obstacle);
        }
    }, 5000);
}

// Move game objects function
function moveGameObjects() {
    if (!gameActive) return;
    
    // Move targets
    targets.forEach(target => {
        const speedX = parseFloat(target.dataset.speedX);
        const speedY = parseFloat(target.dataset.speedY);
        
        let left = parseFloat(target.style.left);
        let top = parseFloat(target.style.top);
        
        // Bounce off walls
        if (left <= 0 || left >= gameArea.offsetWidth - 30) {
            target.dataset.speedX = -speedX;
        }
        
        if (top <= 0 || top >= gameArea.offsetHeight - 30) {
            target.dataset.speedY = -speedY;
        }
        
        // Update position
        left += parseFloat(target.dataset.speedX);
        top += parseFloat(target.dataset.speedY);
        
        target.style.left = left + 'px';
        target.style.top = top + 'px';
    });
    
    // Move obstacles
    obstacles.forEach(obstacle => {
        const speedX = parseFloat(obstacle.dataset.speedX);
        const speedY = parseFloat(obstacle.dataset.speedY);
        
        let left = parseFloat(obstacle.style.left);
        let top = parseFloat(obstacle.style.top);
        
        // Bounce off walls
        if (left <= 0 || left >= gameArea.offsetWidth - 40) {
            obstacle.dataset.speedX = -speedX;
        }
        
        if (top <= 0 || top >= gameArea.offsetHeight - 40) {
            obstacle.dataset.speedY = -speedY;
        }
        
        // Update position
        left += parseFloat(obstacle.dataset.speedX);
        top += parseFloat(obstacle.dataset.speedY);
        
        obstacle.style.left = left + 'px';
        obstacle.style.top = top + 'px';
    });
}

// Move character function
function moveCharacter() {
    if (!gameActive) return;
    
    if (keys['ArrowUp'] || keys['w']) {
        characterPos.y = Math.max(characterPos.y - moveSpeed, 0);
    }
    if (keys['ArrowDown'] || keys['s']) {
        characterPos.y = Math.min(characterPos.y + moveSpeed, gameArea.offsetHeight - 50);
    }
    if (keys['ArrowLeft'] || keys['a']) {
        characterPos.x = Math.max(characterPos.x - moveSpeed, 0);
    }
    if (keys['ArrowRight'] || keys['d']) {
        characterPos.x = Math.min(characterPos.x + moveSpeed, gameArea.offsetWidth - 50);
    }
    
    character.style.left = characterPos.x + 'px';
    character.style.top = characterPos.y + 'px';
    
    // Check for collisions with targets
    targets.forEach(target => {
        const targetRect = target.getBoundingClientRect();
        const characterRect = character.getBoundingClientRect();
        
        if (
            characterRect.left < targetRect.right &&
            characterRect.right > targetRect.left &&
            characterRect.top < targetRect.bottom &&
            characterRect.bottom > targetRect.top
        ) {
            // Collision detected
            target.remove();
            targets = targets.filter(t => t !== target);
            
            // Increment score
            score++;
            scoreElement.textContent = score;
            
            // Check if game is won
            if (score >= 15) {
                gameWon();
            }
        }
    });
    
    // Check for collisions with obstacles
    obstacles.forEach(obstacle => {
        const obstacleRect = obstacle.getBoundingClientRect();
        const characterRect = character.getBoundingClientRect();
        
        if (
            characterRect.left < obstacleRect.right &&
            characterRect.right > obstacleRect.left &&
            characterRect.top < obstacleRect.bottom &&
            characterRect.bottom > obstacleRect.top
        ) {
            // Collision detected
            obstacle.remove();
            obstacles = obstacles.filter(o => o !== obstacle);
            
            // Decrement score and lives
            score = Math.max(0, score - 2); // Lose 2 points
            scoreElement.textContent = score;
            
            lives--;
            livesElement.textContent = lives;
            
            // Flash character to indicate hit
            character.style.backgroundColor = '#ff6b6b';
            setTimeout(() => {
                character.style.backgroundColor = '#6a11cb';
            }, 300);
            
            // Check if game is lost
            if (lives <= 0) {
                gameLost();
            }
        }
    });
}

// Update timer function
function updateTimer() {
    if (!gameActive) return;
    
    timeRemaining--;
    timerElement.textContent = timeRemaining;
    
    if (timeRemaining <= 0) {
        gameLost();
    }
}

// Start game function
function startGame() {
    gameActive = true;
    score = 0;
    lives = 3;
    timeRemaining = 60;
    
    scoreElement.textContent = '0';
    livesElement.textContent = '3';
    timerElement.textContent = '60';
    
    // Clear existing targets and obstacles
    targets.forEach(target => target.remove());
    targets = [];
    
    obstacles.forEach(obstacle => obstacle.remove());
    obstacles = [];
    
    // Reset character position
    characterPos = { x: 10, y: 10 };
    character.style.left = characterPos.x + 'px';
    character.style.top = characterPos.y + 'px';
    
    // Start creating targets and obstacles
    createTarget();
    createObstacle();
    
    clearInterval(targetInterval);
    clearInterval(obstacleInterval);
    clearInterval(gameInterval);
    clearInterval(timerInterval);
    
    targetInterval = setInterval(createTarget, 1200);
    obstacleInterval = setInterval(createObstacle, 2000);
    gameInterval = setInterval(() => {
        moveCharacter();
        moveGameObjects();
    }, 30);
    timerInterval = setInterval(updateTimer, 1000);
    
    // Change button text
    startGameBtn.textContent = 'Restart Game';
}

// Game won function
function gameWon() {
    gameActive = false;
    clearAllIntervals();
    
    // Show congratulations alert
    setTimeout(() => {
        alert('Congratulations! You\'ve conquered the challenge and unlocked the invitation!');
        
        // Show invitation
        gameContainer.style.display = 'none';
        invitationContainer.style.display = 'block';
        
        // Check for senior ID in URL
        loadSeniorPhoto();
    }, 100);
}

// Game lost function
function gameLost() {
    gameActive = false;
    clearAllIntervals();
    
    // Show game over alert
    setTimeout(() => {
        alert('Game Over! Try again to unlock the invitation.');
        
        // Reset for a new game
        lives = 3;
        livesElement.textContent = '3';
        timeRemaining = 60;
        timerElement.textContent = '60';
        score = 0;
        scoreElement.textContent = '0';
    }, 100);
}

// Clear all intervals function
function clearAllIntervals() {
    clearInterval(gameInterval);
    clearInterval(targetInterval);
    clearInterval(obstacleInterval);
    clearInterval(timerInterval);
}

// Event listeners
startGameBtn.addEventListener('click', startGame);

window.addEventListener('keydown', (e) => {
    keys[e.key] = true;
    
    // Prevent page scrolling with arrow keys
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
    }
});

window.addEventListener('keyup', (e) => {
    keys[e.key] = false;
});

// Character click handling for mobile
character.addEventListener('touchstart', (e) => {
    e.preventDefault();
    character.dataset.touched = 'true';
});

gameArea.addEventListener('touchmove', (e) => {
    if (character.dataset.touched === 'true' && gameActive) {
        e.preventDefault();
        const touch = e.touches[0];
        const gameAreaRect = gameArea.getBoundingClientRect();
        
        const newX = touch.clientX - gameAreaRect.left - 25;
        const newY = touch.clientY - gameAreaRect.top - 25;
        
        characterPos.x = Math.max(0, Math.min(newX, gameAreaRect.width - 50));
        characterPos.y = Math.max(0, Math.min(newY, gameAreaRect.height - 50));
        
        character.style.left = characterPos.x + 'px';
        character.style.top = characterPos.y + 'px';
    }
});

gameArea.addEventListener('touchend', () => {
    character.dataset.touched = 'false';
});

// Load senior photo based on URL parameter
function loadSeniorPhoto() {
const urlParams = new URLSearchParams(window.location.search);
const seniorId = urlParams.get('id');

if (seniorId) {
// Hide all senior cards first
const allSeniorCards = document.querySelectorAll('.senior-card');
allSeniorCards.forEach(card => {
    card.style.display = 'none';
});

// Find the specific senior's photo element
const photoElementId = `senior-${seniorId.toLowerCase()}-photo`;
const photoElement = document.getElementById(photoElementId);

if (photoElement) {
    // Show only this senior's card
    const seniorCard = photoElement.closest('.senior-card');
    if (seniorCard) {
        seniorCard.style.display = 'flex';
        seniorCard.style.transform = 'scale(1.05)';
        seniorCard.style.boxShadow = '0 15px 30px rgba(106, 17, 203, 0.3)';
        
        // Make this card take full width
        seniorCard.style.gridColumn = '1 / -1';
        seniorCard.style.maxWidth = '300px';
        seniorCard.style.margin = '0 auto';
    }
}
}
}

// Call this function when the page loads in case the user has the ID in URL
window.addEventListener('load', () => {
// Check if invitation should be shown directly (for debugging or direct links)
const urlParams = new URLSearchParams(window.location.search);
const showInvitation = urlParams.get('showInvitation');

if (showInvitation === 'true') {
gameContainer.style.display = 'none';
invitationContainer.style.display = 'block';
loadSeniorPhoto();
}
});