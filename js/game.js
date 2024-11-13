document.addEventListener('DOMContentLoaded', () => {
  const car = document.getElementById('car');
  const incomingCarsContainer = document.getElementById('incomingCars');
  const carSound = document.getElementById('carSound');
  const soundToggle = document.getElementById('soundToggle');
  const fullScreenToggle = document.getElementById('fullScreenToggle');
  const scoreDisplay = document.getElementById('score');
  const gameOverModal = document.getElementById('gameOverModal');
  const finalScore = document.getElementById('finalScore');
  const playAgainButton = document.getElementById('playAgainButton');
  const closeButton = document.getElementById('closeButton');

  let soundOn = true;
  let score = 0;
  let gameRunning = true;
  let gameInterval;
  let scoreInterval;

  // Positioning variables
  let positionX = window.innerWidth * 0.475;
  let positionY = window.innerHeight * 0.75;

  const updateCarPosition = () => {
    car.style.left = `${positionX}px`;
    car.style.top = `${positionY}px`;
  };

  document.addEventListener('keydown', (event) => {
    const step = 10;
    switch (event.key) {
      case 'ArrowLeft':
        if (positionX > 0) positionX -= step;
        break;
      case 'ArrowRight':
        if (positionX + car.offsetWidth < window.innerWidth) positionX += step;
        break;
      case 'ArrowUp':
        if (positionY > 0) positionY -= step;
        break;
      case 'ArrowDown':
        if (positionY + car.offsetHeight < window.innerHeight) positionY += step;
        break;
    }
    updateCarPosition();
  });

  // Toggle sound
  soundToggle.addEventListener('click', () => {
    soundOn = !soundOn;
    if (soundOn) {
      carSound.play();
      soundToggle.textContent = 'Sound: On';
    } else {
      carSound.pause();
      soundToggle.textContent = 'Sound: Off';
    }
  });

  // Toggle full screen
  fullScreenToggle.addEventListener('click', () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  });

  // Spawn incoming cars
  const spawnIncomingCar = () => {
    const incomingCar = document.createElement('div');
    incomingCar.classList.add('incomingCar');
    incomingCar.style.left = `${Math.random() * (window.innerWidth - 50)}px`;
    incomingCar.style.top = '0px';
    incomingCarsContainer.appendChild(incomingCar);

    const carInterval = setInterval(() => {
      const carTop = parseInt(incomingCar.style.top);
      if (carTop > window.innerHeight) {
        incomingCar.remove();
        clearInterval(carInterval);
      } else {
        incomingCar.style.top = carTop + 5 + 'px';
      }

      if (detectCollision(car, incomingCar)) {
        endGame();
      }
    }, 50);
  };

  // Collision detection
  const detectCollision = (car1, car2) => {
    const car1Rect = car1.getBoundingClientRect();
    const car2Rect = car2.getBoundingClientRect();
    return !(
      car1Rect.top > car2Rect.bottom ||
      car1Rect.bottom < car2Rect.top ||
      car1Rect.right < car2Rect.left ||
      car1Rect.left > car2Rect.right
    );
  };

  // Update score display
  const updateScoreDisplay = () => {
    scoreDisplay.textContent = `Score: ${score}`;
  };

  // Increase score every second
  const startScoreInterval = () => {
    scoreInterval = setInterval(() => {
      if (gameRunning) {
        score++;
        updateScoreDisplay();
      }
    }, 1000);
  };

  // End the game, show score, and save final score
  const endGame = () => {
    gameRunning = false;
    clearInterval(gameInterval);
    clearInterval(scoreInterval);
    saveScore(score);
    showGameOverModal();
  };

  const showGameOverModal = () => {
    finalScore.textContent = score;
    gameOverModal.style.display = 'block';
  };

 
 

 /* function saveScore(currentScore) {
    const today = new Date();
    const todayDate = today.toISOString().split('T')[0]; // YYYY-MM-DD
  
    // Log currentScore and highestScore
    console.log("Current Score:", currentScore);
    console.log("Current Highest Score:", highestScore);
  
    // Update highest score if current score is higher
    if (currentScore > highestScore) {
      highestScore = currentScore;
      localStorage.setItem('highestScore', highestScore);
      console.log("New Highest Score set in localStorage:", highestScore);
    }
  
    // Update the highest score for today in dailyHighestScores
    if (!dailyHighestScores[todayDate] || currentScore > dailyHighestScores[todayDate]) {
      dailyHighestScores[todayDate] = currentScore;
    }
  
    // Save updated daily scores and log the data
    localStorage.setItem('dailyHighestScores', JSON.stringify(dailyHighestScores));
    console.log("Updated dailyHighestScores in localStorage:", dailyHighestScores);
  
    // Update last 10 scores
    scores.push({ date: todayDate, score: currentScore });
    if (scores.length > 10) {
      scores.shift(); // Keep only the last 10 entries
    }
    localStorage.setItem('scores', JSON.stringify(scores));
    console.log("Updated scores array in localStorage:", scores);
  } */
  
  // Trigger this function at the game end to save current score
  // Example usage: saveScore(score);
  

  console.log("saveScore called with score:", currentScore);

  function saveScore(currentScore) {
    const today = new Date();
    const todayDate = today.toISOString().split('T')[0]; // Format as YYYY-MM-DD
  
    // Retrieve or initialize daily highest scores
    let dailyHighestScores = JSON.parse(localStorage.getItem('dailyHighestScores')) || {};
    let highestScore = parseInt(localStorage.getItem('highestScore')) || 0;
  
    // Update daily highest score for today
    if (!dailyHighestScores[todayDate] || currentScore > dailyHighestScores[todayDate]) {
      dailyHighestScores[todayDate] = currentScore;
    }
    localStorage.setItem('dailyHighestScores', JSON.stringify(dailyHighestScores));
  
    // Update highest score if current score exceeds it
    if (currentScore > highestScore) {
      highestScore = currentScore;
      localStorage.setItem('highestScore', highestScore);
    }
  
    // Save last 10 scores
    let last10Scores = JSON.parse(localStorage.getItem('last10Scores')) || [];
    last10Scores.push({ date: todayDate, score: currentScore });
  
    // Keep only the last 10 scores
    if (last10Scores.length > 10) last10Scores.shift();
    localStorage.setItem('last10Scores', JSON.stringify(last10Scores));
  }
  


try {
  localStorage.setItem('testKey', 'testValue');
  localStorage.removeItem('testKey');
  console.log('Local storage is available.');
} catch (error) {
  console.error('Local storage is not accessible:', error);
}











  // Restart the game
  const startGame = () => {
    gameRunning = true;
    score = 0;
    updateScoreDisplay();
    gameInterval = setInterval(spawnIncomingCar, 2000);
    startScoreInterval();
    updateCarPosition();
  };

  // Event listeners for Game Over modal
  playAgainButton.addEventListener('click', () => {
    gameOverModal.style.display = 'none';
    startGame();
  });

  closeButton.addEventListener('click', () => {
    gameOverModal.style.display = 'none';
  });

  // Start the game initially
  startGame();
});
