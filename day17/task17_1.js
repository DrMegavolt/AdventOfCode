import { readDataLines } from "../common/index.js";
// parse input
const lines = readDataLines("day17/input_test.txt");
let jetPattern = lines[0].split("").map((c) => (c === "<" ? -1 : 1));
const rockTypes = {
  0: [
    ["@", "@"], // square
    ["@", "@"],
  ],
  1: [
    ["@"],
    ["@"], // horizontal
    ["@"], // stick
    ["@"],
  ],
  2: [
    [".", "@", "."], // plus
    ["@", "@", "@"],
    [".", "@", "."],
  ],
  3: [
    ["@", ".", "."], // mirrored L, will fall ^ this way
    ["@", ".", "."],
    ["@", "@", "@"],
  ],
  4: [["@", "@", "@", "@"]],
};
// cave 7 units wide, each initialized as floor
// let cave = new Array(7).fill().map(() => []);
let superCave = new Array(7).fill();
let rockCounter = 1;
let yOffset = 3;

// let maxRocks = 2022;
// let maxRocks = 1000000000000;
let maxRocks = 10000000;
work();

// let cols = cave.map((col) => col.lastIndexOf("#"));
let cols = superCave.map((col) => col);
console.log("PART 1", Math.max(...cols) - 1);
console.log("PART 1", yOffset - 1);

function work() {
  while (rockCounter <= maxRocks + 1) {
    //   console.log("NEW ROCK");
    // if (rockCounter % 10000000 === 0) {
    //   console.log(
    //     "ROCK",
    //     rockCounter,
    //     ((rockCounter / maxRocks) * 100).toFixed(4),
    //     "%"
    //   );
    // }
    let rock = generateRock(rockCounter);
    dropRock(rock);
  }
}

function dropRock(rock) {
  let move = 0;
  let xOffset = 2; // 2 positions from the left wall

  while (true) {
    // read jet pattern
    let j = nextJet();
    // check of jet can push rock
    // if yes, push rock
    let isValidJetMove = checkNextStepValid(rock, xOffset + j, yOffset, move);

    if (isValidJetMove) {
      xOffset += j;
    }

    // check if rock can fall
    // if yes, fall rock
    // if no, draw rock as # and move to next rock
    let canFall = checkNextStepValid(rock, xOffset, yOffset, move + 1);
    if (canFall) {
      move++;
    } else {
      // draw rock as # and move to next rock
      //   console.log("DONE with rock:", rockCounter);
      rockCounter++;

      draw(rock, xOffset, yOffset, move, "#"); // freeze rock
      yOffset = Math.max(yOffset, yOffset + rock[0].length - move + 3);

      //   printCave();
      break;
    }
  }
  return { xOffset };
}

function checkNextStepValid(rock, xOffset, yOffset, move) {
  if (xOffset + rock.length > superCave.length || xOffset < 0) {
    return false;
  }
  if (move < 3) {
    // no obstacles
    return true;
  }

  let yShift = yOffset - move;
  for (let x = 0; x < rock.length; x++) {
    for (let y = 0; y < rock[0].length; y++) {
      if (rock[x][y] !== "@") {
        continue;
      }
      let newX = x + xOffset;
      let newY = y + yShift;
      if (
        superCave[newX] >= newY || // overlap
        newY < 0
      ) {
        return false;
      }
    }
  }
  return true;
}

function draw(rock, xOffset, yOffset, move, symbol) {
  for (let x = 0; x < rock.length; x++) {
    for (let y = 0; y < rock[0].length; y++) {
      if (rock[x][y] === "@") {
        superCave[x + xOffset] = y + yOffset - move;
      }
    }
  }
}

function generateRock(i) {
  let type = i % 5;
  return rockTypes[type];
}

function nextJet() {
  let next = jetPattern.shift();
  jetPattern.push(next);
  return next;
}
