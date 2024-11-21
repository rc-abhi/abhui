// Symbols for the slot machine
const symbols = ["🍒", "🍋", "🍊", "⭐", "🍇"];
let balance = 0; // Player's balance

// Audio elements
const backgroundAudio = document.getElementById("backgroundAudio");
const winSound = document.getElementById("winSound");
const loseSound = document.getElementById("loseSound");

// Ensure background audio is played after user interaction
function playBackgroundAudio() {
  backgroundAudio.play().catch(() => {
    console.log("Background audio autoplay blocked. Waiting for user interaction.");
  });
}

// Play background music on user interaction
document.addEventListener("click", playBackgroundAudio);
document.addEventListener("keydown", playBackgroundAudio);

// Mute/Unmute functionality
let isMuted = false;
document.getElementById("muteButton").addEventListener("click", () => {
  isMuted = !isMuted;
  document.getElementById("muteButton").textContent = isMuted ? "Unmute" : "Mute";
  backgroundAudio.muted = isMuted;
  winSound.muted = isMuted;
  loseSound.muted = isMuted;
});

// Update balance display
function updateBalanceDisplay() {
  document.getElementById("balance").textContent = balance.toFixed(2);
}

// Get a random symbol for the reels
function getRandomSymbol() {
  return symbols[Math.floor(Math.random() * symbols.length)];
}

// Handle deposit
document.getElementById("depositButton").addEventListener("click", () => {
  const depositAmount = parseFloat(document.getElementById("depositAmount").value);
  if (!isNaN(depositAmount) && depositAmount > 0) {
    balance += depositAmount;
    updateBalanceDisplay();
    document.getElementById("depositAmount").value = "";
    handleBetInput(); // Update spin button state
  } else {
    alert("Enter a valid deposit amount!");
  }
});

// Enable or disable spin button based on bet amount
function handleBetInput() {
  const betAmount = parseFloat(document.getElementById("betAmount").value);
  const spinButton = document.getElementById("spinButton");
  spinButton.disabled = isNaN(betAmount) || betAmount <= 0 || betAmount > balance;
}

// Spin the reels
function spinReels(betAmount) {
  const spinButton = document.getElementById("spinButton");
  spinButton.disabled = true; // Disable spin button during audio playback

  const reel1 = document.getElementById("reel1");
  const reel2 = document.getElementById("reel2");
  const reel3 = document.getElementById("reel3");

  // Generate random results
  const result1 = getRandomSymbol();
  const result2 = getRandomSymbol();
  const result3 = getRandomSymbol();

  reel1.textContent = result1;
  reel2.textContent = result2;
  reel3.textContent = result3;

  const resultDisplay = document.getElementById("result");

  // Determine win or loss
  if (result1 === result2 && result2 === result3) {
    const winAmount = betAmount * 3;
    balance += winAmount;
    resultDisplay.textContent = '🎉 You win ${winAmount.toFixed(2)}!';
    playAudio(winSound, spinButton); // Play win sound and re-enable button
  } else {
    resultDisplay.textContent = "Try again!";
    playAudio(loseSound, spinButton); // Play lose sound and re-enable button
  }

  updateBalanceDisplay();
}

// Play audio for 1 second and then re-enable the spin button
function playAudio(audio, spinButton) {
  audio.currentTime = 0; // Reset audio to start
  audio.play();

  setTimeout(() => {
    audio.pause(); // Stop audio after 1 second
    spinButton.disabled = false; // Re-enable spin button
  }, 1000);
}

// Handle spin button click
document.getElementById("spinButton").addEventListener("click", () => {
  const betAmount = parseFloat(document.getElementById("betAmount").value);
  if (!isNaN(betAmount) && betAmount > 0 && betAmount <= balance) {
    balance -= betAmount;
    updateBalanceDisplay();
    spinReels(betAmount);
  } else {
    alert("Invalid bet amount!");
  }

  handleBetInput(); // Update spin button state
});

// Monitor bet input changes
document.getElementById("betAmount").addEventListener("input", handleBetInput);