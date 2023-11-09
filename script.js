const bingoCard = document.getElementById("bingo-card");
const startGameButton = document.getElementById("start-game");
const nextRoundButton = document.getElementById("next-round");
const autoPlayButton = document.getElementById("auto-play-button");
const restartButton = document.getElementById("restart-game");
const playAgainButton = document.getElementById("play-again");
const drawnNumbersContainer = document.getElementById("drawn-numbers");
const allDrawnNumbersContainer = document.getElementById("all-drawn-numbers");
const numbers = new Set();
const cardSize = 5;

let bingoNumbers = [];
let isGameWon = false;
let isAutoPlaying = false;

function generateBingoCard() {
  const card = [];
  const usedNumbers = new Set();

  while (card.length < cardSize * cardSize) {
    const number = Math.floor(Math.random() * 100) + 1;
    if (!usedNumbers.has(number)) {
      usedNumbers.add(number);
      card.push(number);
    }
  }
  return card;
}

function createAndDisplayBingoCard() {
  bingoCard.innerHTML = "";
  bingoNumbers = generateBingoCard();

  for (let i = 0; i < cardSize; i++) {
    for (let j = 0; j < cardSize; j++) {
      const numberCell = document.createElement("div");
      numberCell.classList.add("bingo-number");
      numberCell.innerText = bingoNumbers[i * cardSize + j];
      bingoCard.appendChild(numberCell);
    }
  }
}

function checkForWin() {
  if (isGameWon) return;

  const lines = [...Array(cardSize)].map((_, index) =>
    bingoNumbers.slice(index * cardSize, (index + 1) * cardSize)
  );

  // Check rows
  for (let i = 0; i < cardSize; i++) {
    if (lines[i].every((num) => numbers.has(num))) {
      isGameWon = true;
      highlightWinningLine(lines[i].map((_, j) => i * cardSize + j));
      break;
    }
  }

  // Check columns
  for (let j = 0; j < cardSize; j++) {
    const column = Array.from({ length: cardSize }, (_, i) => lines[i][j]);
    if (column.every((num) => numbers.has(num))) {
      isGameWon = true;
      highlightWinningLine(
        Array.from({ length: cardSize }, (_, i) => i * cardSize + j)
      );
      break;
    }
  }

  // Check diagonals
  const diagonal1 = Array.from(
    { length: cardSize },
    (_, i) => i * cardSize + i
  );
  if (diagonal1.every((num) => numbers.has(bingoNumbers[num]))) {
    isGameWon = true;
    highlightWinningLine(diagonal1);
  }

  const diagonal2 = Array.from(
    { length: cardSize },
    (_, i) => i * cardSize + (cardSize - 1 - i)
  );
  if (diagonal2.every((num) => numbers.has(bingoNumbers[num]))) {
    isGameWon = true;
    highlightWinningLine(diagonal2);
  }

  if (isGameWon) {
    isAutoPlaying = false;
    nextRoundButton.disabled = true;
    playAgainButton.disabled = false;
  }
}

function highlightWinningLine(numbersToHighlight) {
  numbersToHighlight.forEach((index) => {
    const numberCell = bingoCard.children[index];
    numberCell.style.backgroundColor = "lightgreen";
  });
}

function autoPlayNumbers(number = 1) {
  if (!isAutoPlaying) {
    isAutoPlaying = true;
    playNumbers(number);
  }
}

function playNumbers(number) {
  setTimeout(() => {
    if (isAutoPlaying) {
      const drawnNumber = drawNumber();
      if (drawnNumber) {
        updateDrawnNumber(drawnNumber);
        crossOffNumber(drawnNumber);
        checkForWin();

        if (isAutoPlaying && number < 100) {
          playNumbers(number + 1);
        } else {
          isAutoPlaying = false;
        }
      }
    }
  }, 20);
}

function stopAutoPlay() {
  isAutoPlaying = false;
}

startGameButton.addEventListener("click", () => {
  createAndDisplayBingoCard();
  startGameButton.disabled = true;
  nextRoundButton.disabled = false;
  restartButton.disabled = false;
  playAgainButton.disabled = true;
  numbers.clear();
  drawnNumbersContainer.innerHTML = "";
  allDrawnNumbersContainer.innerHTML = "";
  isGameWon = false;
  stopAutoPlay();
  resetCard();
});

nextRoundButton.addEventListener("click", () => {
  const drawnNumber = drawNumber();
  if (drawnNumber) {
    updateDrawnNumber(drawnNumber);
    crossOffNumber(drawnNumber);
    checkForWin();
    stopAutoPlay();
  }
});

autoPlayButton.addEventListener("click", () => {
  autoPlayNumbers();
});

restartButton.addEventListener("click", () => {
  createAndDisplayBingoCard();
  startGameButton.disabled = true;
  nextRoundButton.disabled = false;
  restartButton.disabled = false;
  playAgainButton.disabled = true;
  numbers.clear();
  drawnNumbersContainer.innerHTML = "";
  allDrawnNumbersContainer.innerHTML = "";
  isGameWon = false;
  stopAutoPlay();
  resetCard();
});

playAgainButton.addEventListener("click", () => {
  createAndDisplayBingoCard();
  startGameButton.disabled = true;
  nextRoundButton.disabled = false;
  restartButton.disabled = true;
  playAgainButton.disabled = true;
  numbers.clear();
  drawnNumbersContainer.innerHTML = "";
  allDrawnNumbersContainer.innerHTML = "";
  isGameWon = false;
  stopAutoPlay();
  resetCard();
});

function resetCard() {
  const bingoNumbers = document.querySelectorAll(".bingo-number");
  bingoNumbers.forEach((numberCell) => {
    numberCell.classList.remove("crossed-off");
    numberCell.style.backgroundColor = "lightblue";
  });
}

function drawNumber() {
  const unusedNumbers = [...Array(100)]
    .map((_, i) => i + 1)
    .filter((num) => !numbers.has(num));
  if (unusedNumbers.length === 0) {
    return null;
  }
  const index = Math.floor(Math.random() * unusedNumbers.length);
  const drawnNumber = unusedNumbers[index];
  numbers.add(drawnNumber);
  return drawnNumber;
}

function updateDrawnNumber(number) {
  const drawnNumberElement = document.createElement("div");
  const allDrawnNumbersElement = document.createElement("div");
  drawnNumberElement.innerText = number;
  drawnNumbersContainer.innerHTML = number;
  allDrawnNumbersElement.innerText = number + " - ";
  allDrawnNumbersContainer.appendChild(allDrawnNumbersElement);
}

function crossOffNumber(number) {
  const bingoNumbers = document.querySelectorAll(".bingo-number");
  bingoNumbers.forEach((numberCell) => {
    if (numberCell.innerText === number.toString()) {
      numberCell.style.backgroundColor = "red";
    }
  });
}
