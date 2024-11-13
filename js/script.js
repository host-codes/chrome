//const canvas = document.getElementById("gameCanvas");
//const ctx = canvas.getContext("2d");

// Initialize variables
let score = 0;
let highestScore = parseInt(localStorage.getItem("highestScore")) || 0;
let previousScore = parseInt(localStorage.getItem("previousScore")) || 0;
let gameOver = false;
let playerSpeed = 5;
let soundEnabled = true;
let scoreIncrementTimer = 0;
let roadDividerPosition = 0;
let playerCarPos = { x: 180, y: 500 };
const enemies = [];
const enemyCarImages = ["https://host-codes.github.io/chrome/assets/enemy1.png", "https://host-codes.github.io/chrome/assets/enemy2.png", "https://host-codes.github.io/chrome/assets/enemy3.png", "https://host-codes.github.io/chrome/assets/enemy4.png", "https://host-codes.github.io/chrome/assets/enemy5.png"]; // Ensure paths are correct
const playerCar = new Image();
playerCar.src = "assets/playerCar.png"; // Ensure path is correct
const crashSound = new Audio("https://host-codes.github.io/chrome/assets/crash.wav");
crashSound.loop = false;

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");


// Initial volume setting
crashSound.volume = parseFloat(document.getElementById("volumeControl").value);

// Sound toggle and volume control
document.getElementById("soundToggle")?.addEventListener("change", (event) => {
  soundEnabled = event.target.checked;
  if (!soundEnabled) crashSound.pause();
});




document.getElementById("volumeControl")?.addEventListener("input", (event) => {
  crashSound.volume = event.target.value;
});

// Key controls for player movement
document.addEventListener("keydown", (e) => {
  if (gameOver) return;
  switch (e.key) {
    case "ArrowLeft":
      if (playerCarPos.x > 0) playerCarPos.x -= playerSpeed;
      break;
    case "ArrowRight":
      if (playerCarPos.x < canvas.width - 40) playerCarPos.x += playerSpeed;
      break;
    case "ArrowUp":
      if (playerCarPos.y > 0) playerCarPos.y -= playerSpeed;
      break;
    case "ArrowDown":
      if (playerCarPos.y < canvas.height - 80) playerCarPos.y += playerSpeed;
      break;
  }
});

// Load saved scores when the game loads
function loadScores() {
  highestScore = parseInt(localStorage.getItem("highestScore")) || 0;
  previousScore = parseInt(localStorage.getItem("previousScore")) || 0;
}

// Initialize enemy cars
function initializeEnemies() {
  const enemyCount = 5;
  for (let i = 0; i < enemyCount; i++) {
    enemies.push({
      x: Math.random() * (canvas.width - 40),
      y: -100 - i * 150,
      speed: 2 + Math.random() * 2,
      image: new Image(),
    });
    enemies[i].image.src = enemyCarImages[i % enemyCarImages.length];
  }
}

// Draw the game elements
function draw() {
  if (gameOver) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw player car
  ctx.drawImage(playerCar, playerCarPos.x, playerCarPos.y, 70, 80);

  // Draw enemies and move them down the screen
  enemies.forEach(enemy => {
    ctx.drawImage(enemy.image, enemy.x, enemy.y, 40, 80);
    enemy.y += enemy.speed;

    if (enemy.y > canvas.height) {
      enemy.y = -100;
      enemy.x = Math.random() * (canvas.width - 40);
      enemy.image.src = enemyCarImages[Math.floor(Math.random() * enemyCarImages.length)];
    }

    if (detectCollision(playerCarPos, enemy)) {
      endGame();
    }
  });

  // Draw the moving road divider
  ctx.strokeStyle = "white";
  ctx.lineWidth = 5;
  for (let i = roadDividerPosition; i < canvas.height; i += 40) {
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, i);
    ctx.lineTo(canvas.width / 2, i + 20);
    ctx.stroke();
  }
  roadDividerPosition += 2; // speed of road divider is 2
  if (roadDividerPosition >= 40) roadDividerPosition = 0;

  // Increment score slowly every 20 frames
  if (scoreIncrementTimer % 20 === 0) {
    score += 1;
    document.getElementById("score").textContent = "Score: " + score;
    updateProgressBar();
  }
  scoreIncrementTimer++;

  if (!gameOver) {
    requestAnimationFrame(draw);
  }
}

// Collision detection
function detectCollision(player, enemy) {
  return (
    player.x < enemy.x + 35 &&
    player.x + 35 > enemy.x &&
    player.y < enemy.y + 38 &&
    player.y + 38 > enemy.y
  );
}

// Game over function
/*function endGame() {
  gameOver = true;
  if (soundEnabled) crashSound.play();
  
  previousScore = score;
  if (score > highestScore) {
    highestScore = score;
    localStorage.setItem("highestScore", highestScore);
  }

  localStorage.setItem("previousScore", previousScore);
  localStorage.setItem("currentScore", score);

  document.getElementById("highestScore").textContent = highestScore;
  document.getElementById("finalScore").textContent = score;
  document.getElementById("previousScore").textContent = previousScore;
  document.getElementById("gameOverPopup").style.display = "block";
}*/


// Adjust volume when progress bar changes
document.getElementById("volumeControl")?.addEventListener("input", (event) => {
  crashSound.volume = parseFloat(event.target.value);  // Set crashSound volume based on progress bar
});

// Game over function
function endGame() {
  gameOver = true;

  // Play sound if enabled, using the adjusted volume from the progress bar
  if (soundEnabled) {
    crashSound.currentTime = 0; // Restart the sound from the beginning
    crashSound.play();
  }
  // Update highest score if the current score is greater
  if (score > highestScore) {
    highestScore = score;
    localStorage.setItem("highestScore", highestScore);
  }

  // Update local storage for current and previous scores
  localStorage.setItem("previousScore", previousScore); // Save previous score as it was before this game
  localStorage.setItem("currentScore", score);           // Save current game score as the latest

  // Update `previousScore` with the score from this game for future games
  previousScore = score;

  // Display scores in the game over popup
  document.getElementById("highestScore").textContent = highestScore;
  document.getElementById("finalScore").textContent = score;
  document.getElementById("previousScore").textContent = localStorage.getItem("previousScore");

  // Show the game over popup
  document.getElementById("gameOverPopup").style.display = "block";
}

  // Update previousScore after saving the current score in local storage






  





// Restart the game
function restartGame() {
  gameOver = false;
  score = 0;
  playerCarPos = { x: 180, y: 500 };
  enemies.length = 0;
  initializeEnemies();
  document.getElementById("score").textContent = "Score: " + score;
  document.getElementById("gameOverPopup").style.display = "none";
  draw();
}

// Progress bar for score visualization
function updateProgressBar() {
  const progress = Math.min(score / 100, 1) * 100; // Example scaling
  document.getElementById("progressBar").style.width = progress + "%";
}

// Set up event listeners
document.getElementById("playAgain")?.addEventListener("click", restartGame);
document.getElementById("closeIcon")?.addEventListener("click", () => {
  document.getElementById("gameOverPopup").style.display = "none";
});





// Collision Detection Function
function checkCollision(playerCar, enemyCar) {
  // Get positions and sizes of player and enemy cars
  const playerLeft = playerCar.x;
  const playerRight = playerCar.x + playerCar.width;
  const playerTop = playerCar.y;
  const playerBottom = playerCar.y + playerCar.height;

  const enemyLeft = enemyCar.x;
  const enemyRight = enemyCar.x + enemyCar.width;
  const enemyTop = enemyCar.y;
  const enemyBottom = enemyCar.y + enemyCar.height;

  // Check if the player car and enemy car overlap
  const isColliding = (
    playerRight > enemyLeft &&
    playerLeft < enemyRight &&
    playerBottom > enemyTop &&
    playerTop < enemyBottom
  );

  return isColliding;
}




// Initialize game state
loadScores();
initializeEnemies();
draw();
