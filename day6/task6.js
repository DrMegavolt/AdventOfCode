import { readFileSync } from "fs";
const input = readFileSync("./signal.txt", "utf8");
// parse input
// const lines = input.split("\n");

function getSignal(input, shift) {
  for (let i = 0; i < input.length; i++) {
    let code = input.slice(i, i + shift);
    if (new Set(code).size === shift) {
      console.log(i + shift);

      break;
    }
  }
}
console.log(getSignal(input, 4));
console.log(getSignal(input, 14));
