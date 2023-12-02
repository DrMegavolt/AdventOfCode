import { readDataLines } from "../common/index.js";
// parse input
const lines = readDataLines("day17/input.txt");
let jetPattern = lines[0].split("").map((c) => (c === "<" ? -1 : 1));
let jetIndex = 0;
let maxRocks2 = 1000000000000;
let maxRocks = 2022;

var { cave, droppedHeight } = tetris(jetPattern, jetIndex, maxRocks2);
function caveHeight(cave) {
  let cols = cave.map((col) => col.lastIndexOf("#"));
  return Math.max(...cols) + 1;
}

function tetris(jetPattern, jetIndex, maxRocks) {
  function nextJet() {
    jetIndex = jetIndex % jetPattern.length;
    let next = jetPattern[jetIndex];
    jetIndex++;
    return next;
  }
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
  let droppedHeight;
  let sameRockSameJet = new Map();
  let rockRepeatPeriod;
  let rockRepeatOffset;
  let offsetsCache = new Map();
  let debug = false;
  while (rockCounter <= maxRocks) {
    offsetsCache.set(rockCounter, caveHeight(cave));
    let type = rockCounter % 5;
    let rock = rockTypes[type];
    if (type === 0 && droppedHeight === undefined) {
      // horizontal line is the most wide rock, low chance of overlap
      let k = `${rockCounter % 5}=${jetIndex % jetPattern.length}`;

      let v = sameRockSameJet.get(k);
      if (v) {
        rockRepeatPeriod = rockCounter - v[0];
        rockRepeatOffset = yOffset - v[1];

        // pattern starts at rockCounter
        // each period is rockRepeatPeriod
        // each time tetris is getting higher by rockRepeatOffset
        // we can skip computing the next rocks as long as we fit full pattern before maxRocks
        let skips = Math.floor((maxRocks - rockCounter) / rockRepeatPeriod);
        console.log("SKIPS", skips);
        rockCounter += skips * rockRepeatPeriod;
        // yOffset += skips * rockRepeatOffset;
        droppedHeight = skips * rockRepeatOffset;
        console.log("NEW ROCK COUNTER", rockCounter);
        console.log("Dropped OFFSET", droppedHeight);
      }
      sameRockSameJet.set(k, [rockCounter, yOffset]);
    }

    let xOffset = 2; // 2 positions from the left wall
    yOffset = caveHeight(cave) + 3; // new rock 3 positions higher than the highest rock
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
    droppedHeight,
  };
}

// printCave(cave);
console.log("PART 1", caveHeight(cave) + droppedHeight);

//1526744186042 correct for type 0
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
