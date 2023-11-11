const bingoCardsContainer = document.getElementById("bingo-cards-container");
const startGameButton = document.getElementById("start-game");
const nextRoundButton = document.getElementById("next-round");
const autoPlayButton = document.getElementById("auto-play-button");
const restartButton = document.getElementById("restart-game");
const drawnNumbersContainer = document.getElementById("drawn-numbers");
const allDrawnNumbersContainer = document.getElementById("all-drawn-numbers");
const numberOfCardsInput = document.getElementById("numberOfCards");
const numberOfCardsButton = document.getElementById("numberOfCards-button");
const cardSize = 5;
const numbers = new Set();

let bingoNumbers = [];
let numberOfCards = 1;
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

function createAndDisplayBingoCards() {
  bingoNumbers = [];
  bingoCardsContainer.innerHTML = "";

  for (let cardIndex = 0; cardIndex < numberOfCards; cardIndex++) {
    const bingoCardContainer = document.createElement("div");
    bingoCardContainer.classList.add("bingo-card-container");
    bingoCardContainer.style.borderColor = "black";
    bingoCardsContainer.appendChild(bingoCardContainer);

    const card = generateBingoCard();
    bingoNumbers.push(card);

    const bingoCard = document.createElement("div");
    bingoCard.classList.add("bingo-card");

    for (let i = 0; i < cardSize; i++) {
      for (let j = 0; j < cardSize; j++) {
        const numberCell = document.createElement("div");
        numberCell.classList.add("bingo-number");
        numberCell.innerText = card[i * cardSize + j];
        bingoCard.appendChild(numberCell);
      }
    }

    bingoCardContainer.appendChild(bingoCard);
  }
}

function checkForWin() {
  if (isGameWon) return;

  for (let cardIndex = 0; cardIndex < numberOfCards; cardIndex++) {
    const cardNumbers = bingoNumbers[cardIndex];
    const lines = [...Array(cardSize)].map((_, index) =>
      cardNumbers.slice(index * cardSize, (index + 1) * cardSize)
    );

    if (isWinningCard(lines)) {
      isGameWon = true;
      highlightWinningLine(
        lines.map((_, j) => cardIndex * cardSize + j),
        cardIndex
      );
      break;
    }
  }

  if (isGameWon) {
    isAutoPlaying = false;
    nextRoundButton.disabled = true;
    startGameButton.disabled = false;
  }
}

function isWinningCard(lines) {
  for (let i = 0; i < cardSize; i++) {
    if (lines[i].every((num) => numbers.has(num))) {
      return true;
    }
  }

  for (let j = 0; j < cardSize; j++) {
    const column = Array.from({ length: cardSize }, (_, i) => lines[i][j]);
    if (column.every((num) => numbers.has(num))) {
      return true;
    }
  }

  const diagonal1 = Array.from(
    { length: cardSize },
    (_, i) => i * cardSize + i
  );
  if (diagonal1.every((num) => numbers.has(bingoNumbers[num]))) {
    return true;
  }

  const diagonal2 = Array.from(
    { length: cardSize },
    (_, i) => i * cardSize + (cardSize - 1 - i)
  );
  if (diagonal2.every((num) => numbers.has(bingoNumbers[num]))) {
    return true;
  }

  return false;
}

function highlightWinningLine(numbersToHighlight, cardIndex) {
  const bingoCardContainers = document.getElementsByClassName(
    "bingo-card-container"
  );
  if (cardIndex >= 0 && cardIndex < bingoCardContainers.length) {
    const bingoCardContainer = bingoCardContainers[cardIndex];
    const bingoCard = bingoCardContainer.querySelector(".bingo-card");
    if (bingoCard) {
      numbersToHighlight.forEach((index) => {
        if (index >= 0 && index < bingoCard.children.length) {
          const numberCell = bingoCard.children[index];

          if (numberCell) {
            numberCell.style.backgroundColor = "lightgreen";
          }
        }
      });
      bingoCardContainer.style.borderColor = "lightgreen";
      bingoCardContainer.style.backgroundColor = "green";
    }
  }
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

  try {
    const index = Math.floor(Math.random() * unusedNumbers.length);
    const drawnNumber = unusedNumbers[index];
    numbers.add(drawnNumber);
    return drawnNumber;
  } catch (error) {
    console.error(`Error drawing number: ${error.message}`);
    return null;
  }
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

function startNewGame() {
  createAndDisplayBingoCards();
  startGameButton.disabled = true;
  nextRoundButton.disabled = false;
  restartButton.disabled = false;
  autoPlayButton.disabled = false;
  numbers.clear();
  drawnNumbersContainer.innerHTML = "";
  allDrawnNumbersContainer.innerHTML = "";
  isGameWon = false;
  stopAutoPlay();
  resetCard();

  // Reset border color of all bingo card containers
  const bingoCardContainers = document.getElementsByClassName(
    "bingo-card-container"
  );

  for (let i = 0; i < bingoCardContainers.length; i++) {
    bingoCardContainers[i].style.borderColor = "black";
  }
}

startGameButton.addEventListener("click", () => {
  startNewGame();
});

nextRoundButton.addEventListener("click", () => {
  for (let cardIndex = 0; cardIndex < numberOfCards; cardIndex++) {
    const drawnNumber = drawNumber();
    if (drawnNumber) {
      updateDrawnNumber(drawnNumber);
      crossOffNumber(drawnNumber, cardIndex);
    }
  }
  autoPlayButton.disabled = false;
  checkForWin();
  stopAutoPlay();
});

autoPlayButton.addEventListener("click", () => {
  autoPlayButton.disabled = true;
  autoPlayNumbers();
});

restartButton.addEventListener("click", () => {
  startNewGame();
});

numberOfCardsButton.addEventListener("click", () => {
  numberOfCards = parseInt(numberOfCardsInput.value, 10) || 1;
});
