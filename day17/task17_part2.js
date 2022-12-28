import { readDataLines } from "../common/index.js";
// parse input
const lines = readDataLines("day17/input_test.txt");
let jetPattern = lines[0].split("").map((c) => (c === "<" ? -1 : 1));
let jetIndex = 0;
let maxRocks2 = 1000000000000;
let maxRocks = 2022;

var { cave, rock4repeatPeriod, rock4repeatOffset, offsetsCache } = tetris(
  jetPattern,
  jetIndex,
  maxRocks
);

function tetris(jetPattern, jetIndex, maxRocks = 2022) {
  function checkNextStepValid(rock, xOffset, yOffset, move) {
    //   console.log("CHECK NEXT STEP VALID", xOffset, yOffset, move);
    let yShift = yOffset - move;
    for (let x = 0; x < rock.length; x++) {
      for (let y = 0; y < rock[0].length; y++) {
        if (rock[x][y] !== "@") {
          continue;
        }
        let newX = x + xOffset;
        let newY = y + yShift;
        if (
          newX >= cave.length || // out of bounds
          newX < 0 ||
          newY < 0 ||
          cave[newX][newY] === "#" // overlap
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
          cave[x + xOffset][y + yOffset - move] = symbol;
        }
      }
    }
  }
  const rockTypes = {
    0: [
      ["@", "@"],
      ["@", "@"],
    ],
    1: [["@"], ["@"], ["@"], ["@"]],
    2: [
      [".", "@", "."],
      ["@", "@", "@"],
      [".", "@", "."],
    ],
    3: [
      ["@", ".", "."],
      ["@", ".", "."],
      ["@", "@", "@"],
    ],
    4: [["@", "@", "@", "@"]],
  };
  // cave 7 units wide, each initialized as floor
  let cave = new Array(7).fill().map(() => []);
  let rockCounter = 1;
  let yOffset = 4;

  let sameRockSameJet = new Map();
  let rock4repeatPeriod;
  let rock4repeatOffset;
  let offsetsCache = new Map();
  while (rockCounter <= maxRocks) {
    offsetsCache.set(rockCounter, caveHeight(cave));
    let type = rockCounter % 5;
    let rock = rockTypes[type];
    if (type === 2 && rock4repeatPeriod === undefined) {
      // horizontal line is the most wide rock, low chance of overlap
      let k = `${rockCounter % 5}=${jetIndex % jetPattern.length}`;
      let v = sameRockSameJet.get(k);
      if (v) {
        console.log(
          "SAME ROCK SAME JET",
          k,
          v,
          rockCounter,
          rockCounter - v[0]
        );
        console.log(yOffset, v[1], yOffset - v[1]);
        rock4repeatPeriod = rockCounter - v[0];
        rock4repeatOffset = yOffset - v[1];
        // printCave();
        // break;
      }
      sameRockSameJet.set(k, [rockCounter, yOffset]);
      // draw(rock, 2, yOffset, 0, "T");
    }
    let xOffset = 2; // 2 positions from the left wall
    yOffset =
      cave.reduce((max, col) => Math.max(max, col.lastIndexOf("#") + 1), 0) + 3;
    let move = 0;
    while (true) {
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
        yOffset = Math.max(yOffset, yOffset - move + rock[0].length);
        break; // move to next rock
      }
    }
  }
  return {
    cave,
    rock4repeatPeriod,
    rock4repeatOffset,
    offsetsCache,
  };
}

function caveHeight(cave) {
  let cols = cave.map((col) => col.lastIndexOf("#"));
  return Math.max(...cols) + 1;
}
printCave(cave);
console.log("PART 1", caveHeight(cave));

// printCave();
console.log(
  "PART 2: period of rock 4 meets the same jet pattern",
  rock4repeatPeriod
);
console.log(
  "PART 2: offset of rock 4 meets the same jet pattern",
  rock4repeatOffset
);

let rocksBeforePatternStart =
  maxRocks2 - Math.floor(maxRocks2 / rock4repeatPeriod) * rock4repeatPeriod;
console.log(
  "PART 2: rocks that needs to be dropped before pattern starts",
  rocksBeforePatternStart
);

let offsetBeforePatternStart = offsetsCache.get(rocksBeforePatternStart);
console.log(
  "PART 2: offset of rock that needs to be dropped before pattern starts",
  offsetBeforePatternStart
);

let height1Quadrillion =
  Math.floor(maxRocks2 / rock4repeatPeriod) * rock4repeatOffset +
  offsetBeforePatternStart;
console.log("PART 2: height of 1 quadrillion rocks", height1Quadrillion);
//1526744186040 too low rock 0 ; 1526744186040; rock/jet repeat 1720;  offset 2626; rocks before 1440 with offset 2193
//1527906976736 incorre rock 1 ; 1527906976736; rock/jet repeat 1720;  offset 2628; rocks before 1440 with offset 2193
//1527325581388 incorre rock 2 ; 1527325581388; rock/jet repeat 1720;  offset 2627; rocks before 1440 with offset 2193
// but rock 2 gives the best end pattern, no need to account for merge shift
// |.......|
// |.......|
// |..####.|
// |....#..|
// |....#..|
// |....#..|
// |....#..|
// 1527325581389 incorrect
//1525857060216 too low
//1521865889216 too low rock 3 ; 1521865889216; rock/jet repeat 1715;  offset 2610; rocks before 15 with offset 27
//1526744186040 too low rock 4 ; 1526744186040; rock/jet repeat 1720;  offset 2626; rocks before 1440 with offset 2193

function printCave(cave) {
  let maxHeigth = cave.reduce((max, row) => Math.max(max, row.length), 0) + 2;
  for (let i = maxHeigth - 1; i >= 0; i--) {
    let row = i.toString().padEnd(4) + "|";
    for (let j = 0; j < cave.length; j++) {
      row += cave[j][i] || ".";
    }
    console.log(row + "|");
  }
  console.log("+" + "".padStart(cave.length, "-") + "+");
}
function nextJet() {
  jetIndex = jetIndex % jetPattern.length;
  let next = jetPattern[jetIndex];
  jetIndex++;
  return next;
}