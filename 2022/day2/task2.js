// read strategy.txt
import { readFileSync } from "fs";
const input = readFileSync("./strategy.txt", "utf8");
// parse input
const rounds = input.split("\n");

let scores = {
  X: 1, // rock
  A: 1, // rock
  Y: 2, // paper
  B: 2, // paper
  Z: 3, // scissors
  C: 3, // scissors
};
//            X rock  Y paper Z scissors
// A rock     3       6       0
// B paper    0       3       6
// C scissors 6       0       3

let totalScore = 0;
for (let round of rounds) {
  let [player1, player2] = round.split(" ");
  let player1Score = scores[player1];
  let player2Score = scores[player2];

  if (player1Score === player2Score) {
    totalScore += player2Score + 3;
    console.log("Draw", totalScore);
    continue;
  }
  if (
    (player1Score === 1 && player2Score === 3) ||
    (player1Score === 2 && player2Score === 1) ||
    (player1Score === 3 && player2Score === 2)
  ) {
    totalScore += player2Score;
    console.log("Player 1 wins", totalScore);
  } else {
    totalScore += player2Score + 6;
    console.log("Player 2 wins", totalScore);
  }
}

console.log(totalScore);
