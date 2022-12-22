import { readDataLines } from "../common/index.js";
// parse input
const lines = readDataLines("day17/input_test.txt");
let jetPattern = lines[0].split("").map((c) => (c === "<" ? -1 : 1));
let jetIndex = 0;
let rockHeights = [2, 1, 3, 3, 4];
const rockTypes = {
  0: [
    [true, true], // square
    [true, true],
  ],
  1: [
    [true],
    [true], // horizontal
    [true], // stick
    [true],
  ],
  2: [
    [false, true], // plus
    [true, true, true],
    [false, true],
  ],
  3: [
    [true], // mirrored L, will fall ^ this way
    [true],
    [true, true, true],
  ],
  4: [[true, true, true, true]],
};
// cave 7 units wide, each initialized as floor
// let cave = new Array(7).fill().map(() => []);
let superCave = new Array(7).fill();
let rockCounter = 1;
let yOffset = 3;

// let maxRocks = 2022;
let maxRocks = 1000000000000;
// let maxRocks = 10000000;
work();

// let cols = cave.map((col) => col.lastIndexOf("#"));
let cols = superCave.map((col) => col);
console.log("PART 1", Math.max(...cols) - 1);
console.log("PART 1", yOffset - 1);

function work() {
  let start = Date.now();
  console.log(start);
  while (rockCounter <= maxRocks + 1) {
    if (rockCounter % 100000000 === 1) {
      console.log(
        "ROCK",
        rockCounter,
        ((rockCounter / maxRocks) * 100).toFixed(2),
        "%",
        Date.now() - start
      );
    }

    dropRock();
    // rockCounter += 1;
  }
}

function rockHeight(rockType) {
  return rockHeights[rockType];
}
function dropRock() {
  let move = 0;
  let xOffset = 2; // 2 positions from the left wall
  let rockType = rockCounter % 5;
  let rock = rockTypes[rockType];
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
      yOffset = Math.max(yOffset, yOffset + rockHeight(rockType) - move + 3);

      //   printCave();
      break;
    }
  }
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
    let row = rock[x];
    for (let y = 0; y < row.length; y++) {
      if (!row[y]) {
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
    let row = rock[x];
    for (let y = 0; y < row.length; y++) {
      if (row[y] === true) {
        superCave[x + xOffset] = y + yOffset - move;
      }
    }
  }
}

function nextJet() {
  jetIndex = jetIndex % jetPattern.length;
  let next = jetPattern[jetIndex];
  jetIndex++;
  return next;
}
