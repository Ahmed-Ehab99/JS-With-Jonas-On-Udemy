"use strict";

let secretNumber = Math.trunc(Math.random() * 20) + 1;
let scoreValue = 20;
let highscore = 0;
const displayMessage = (message) => {
  document.querySelector(".message").textContent = message;
};

const displayScore = (score) => {
  document.querySelector(".score").textContent = score;
};

const displayNumber = (property, number) => {
  document.querySelector(".number")[property] = number;
};
const changeBodyColor = (color) => {
  document.querySelector("body").style.backgroundColor = color;
};

displayScore(scoreValue);

document.querySelector(".check").addEventListener("click", function () {
  const guess = Number(document.querySelector(".guess").value);

  if (!guess) {
    displayMessage("⛔ No Number!");
  } else if (guess === secretNumber) {
    displayMessage("🎉 Correct Number!");
    displayNumber("innerHTML", secretNumber);
    changeBodyColor("#60b347");
    displayNumber("style.width", "30rem");
    document.querySelector(".check").disabled = true;
    if (scoreValue > highscore) {
      highscore = scoreValue;
      document.querySelector(".highscore").textContent = highscore;
    }
  } else if (guess !== secretNumber) {
    if (scoreValue > 1) {
      guess > secretNumber
        ? displayMessage("👆 Too High!")
        : displayMessage("👇 Too Low!");
      scoreValue--;
      displayScore(scoreValue);
    } else {
      displayMessage("💥 You lost the game!");
      displayScore(0);
    }
  }
});

document.querySelector(".again").addEventListener("click", function () {
  scoreValue = 20;
  secretNumber = Math.trunc(Math.random() * 20) + 1;
  displayMessage("Start guessing...");
  displayScore(scoreValue);
  displayNumber("textContent", "?");
  document.querySelector(".guess").value = "";
  changeBodyColor("#222");
  displayNumber("style.width", "15rem");
});
