// read sacks.txt
import { readFileSync } from "fs";
const input = readFileSync("./sacks.txt", "utf8");
// parse input
const sacks = input.split("\n");

let mistakes = [];

for (let sack of sacks) {
  let l = sack.length;
  let left = sack.slice(0, l / 2);
  let right = sack.slice(l / 2);

  // find same letter in left and right
  for (let letter of left) {
    if (right.includes(letter)) {
      mistakes.push(letter);
      break;
    }
  }
}

// alphabet
const alphabet = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
let alphabetMap = new Map();
alphabet.split("").forEach((letter, index) => {
  alphabetMap.set(letter, index);
});

let totalScore = 0;
for (let mistake of mistakes) {
  totalScore += alphabetMap.get(mistake) + 1;
}

console.log(totalScore);

let rearrangeScore = 0;
for (let i = 0; i < sacks.length; i += 3) {
  let [sack1, sack2, sack3] = [
    new Set(sacks[i].split("")),
    new Set(sacks[i + 1].split("")),
    new Set(sacks[i + 2].split("")),
  ];
  let intersection = [...sack1].filter((x) => sack2.has(x) && sack3.has(x))[0];
  rearrangeScore += alphabetMap.get(intersection) + 1;
  //   let union = new Set([...sack1, ...sack2, ...sack3]);
  //   let difference = new Set([...union].filter((x) => !intersection.has(x)));
}
console.log(rearrangeScore);
