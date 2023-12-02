import { readDataLines } from "../common/index.js";
// parse input
const lines = readDataLines("day15/input.txt");

let data = [];
let maxTargetLine = 4000000;
// let maxX = 20;
let maxX = 4000000;

for (let line of lines) {
  let [x1, y1, x2, y2] = line.match(/(-?\d+)/g).map((n) => parseInt(n));
  data.push([x1, y1, x2, y2]);
}

let nonFilledRow = null;
let missingY = -1;
for (let targetLine = 0; targetLine <= maxTargetLine; targetLine++) {
  console.log("PROCESSING TARGET LINE", targetLine);

  let takenRanges = [];
  for (let [x1, y1, x2, y2] of data) {
    let radius = manhattanDistance(x1, y1, x2, y2);
    let shift = radius - Math.abs(targetLine - y1);
    if (shift < 0) {
      continue;
    }
    let x_left = x1 - shift;
    let x_right = x1 + shift; // left and right from x1
    let xEnd = Math.min(x_right, maxX);
    let xStart = Math.max(x_left, 0);

    if (xStart > maxX || xEnd < 0) {
      continue;
    }

    takenRanges.push([xStart, xEnd]);
  }

  let ranges = takenRanges.sort((a, b) => {
    if (a[0] === b[0]) {
      return a[1] - b[1];
    }
    return a[0] - b[0];
  });

  // join ranges if they overlap
  let r = ranges.shift();
  let mergedRanges = [];
  while (ranges.length > 0) {
    let nextRange = ranges.shift();
    if (r[1] >= nextRange[0] - 1) {
      r[1] = Math.max(r[1], nextRange[1]);
    } else {
      mergedRanges.push(r);
      r = nextRange;
    }
  }
  mergedRanges.push(r);

  if (mergedRanges.length > 1) {
    nonFilledRow = mergedRanges;
    missingY = targetLine;
    break;
  }
}

// find missing number in nonFilledRow
let missingX = -1;
console.log(nonFilledRow);
for (let i = 0; i < nonFilledRow.length - 1; i++) {
  let [x1, x2] = nonFilledRow[i];
  let [x3, x4] = nonFilledRow[i + 1];
  if (x2 + 1 !== x3) {
    missingX = x2 + 1;
    break;
  }
}
console.log("part 2 ---", missingX * 4000000 + missingY);

function manhattanDistance(x1, y1, x2, y2) {
  return Math.abs(x1 - x2) + Math.abs(y1 - y2);
}
