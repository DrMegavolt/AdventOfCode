// read input1.txt
import { readFileSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const input = readFileSync(__dirname + "/input1.txt", "utf8");
// parse input
const lines = input.split("\n");

let elves = [];
let elfCursor = 0;
for (let i = 0; i < lines.length; i++) {
  if (lines[i] === "") {
    elfCursor++;
    continue;
  }

  elves[elfCursor] = elves[elfCursor] || [];
  elves[elfCursor].push(Number(lines[i]));
}

let maxCaloriesElf = findMaxElfPayload(elves);

console.log(maxCaloriesElf);

function findMaxElfPayload(elves) {
  let max = 0;
  let maxElf = 0;
  let payloads = [];
  for (let i = 0; i < elves.length; i++) {
    let elfPayload = 0;
    for (let j = 0; j < elves[i].length; j++) {
      elfPayload += elves[i][j];
    }
    payloads[i] = elfPayload;
    if (elfPayload > max) {
      max = elfPayload;
      maxElf = i;
    }
  }
  payloads.sort((a, b) => b - a);
  let top3 = payloads.slice(0, 3);
  console.log(top3);
  return {
    elfID: maxElf + 1,
    maxElfArrayID: maxElf,
    maxPayload: max,
    top3Payload: top3.reduce((a, b) => a + b, 0),
  };
}
