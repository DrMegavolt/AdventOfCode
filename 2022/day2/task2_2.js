// read strategy.txt
import { readFileSync } from "fs";
const input = readFileSync("./strategy.txt", "utf8");
// parse input
const rounds = input.split("\n");

let scores = {
  A: 1, // rock
  B: 2, // paper
  C: 3, // scissors
};
//            X rock  Y paper Z scissors
// A rock     3       6       0
// B paper    0       3       6
// C scissors 6       0       3

// let strategy = {
//   A: {
//     // 1
//     // rock
//     X: 3, // lose by choosing scissors
//     Y: 1, // draw with rock
//     Z: 2, // win by choosing paper
//   },
//   B: {
//     //2
//     // player 1 choses paper
//     X: 1, // loose by choosing rock
//     Y: 2, // draw with paper
//     Z: 3, // win by choosing scissors
//   },
//   C: {
//     // 3
//     // scissors
//     X: 2, // loose by choosing paper
//     Y: 3, // draw with scissors
//     Z: 1, // win by choosing rock
//   },
// };

let loose = (p1Score) => {
  return p1Score === 1 ? 3 : p1Score - 1;
};
let win = (p1Score) => {
  return p1Score === 3 ? 1 : p1Score + 1;
};

let totalScore = 0;
for (let round of rounds) {
  let [player1, player2] = round.split(" ");
  let player1Score = scores[player1];

  let player2Score =
    player2 === "X"
      ? loose(player1Score)
      : player2 === "Y"
      ? player1Score
      : win(player1Score);

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
