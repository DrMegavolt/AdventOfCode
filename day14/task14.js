import { readDataAsMap, readDataLines } from "../common/index.js";
// parse input
const wallScans = readDataAsMap("day14/input_test.txt", { split: " -> " });

// console.log(wallScans);

// sand falls from 500,0
let maxRow = 0;

for (let sc of wallScans.flat()) {
  const [col, row] = sc.split(",").map((n) => parseInt(n));
  if (row > maxRow) {
    maxRow = row;
  }
}
let minCol = 500 - maxRow - 10;
let maxCol = 500 + maxRow + 10; // add some space

// console.log(minCol, maxCol, maxRow);

let cave = new Array(maxRow + 1);

for (let i = 0; i < maxRow + 1; i++) {
  //   console.log(i);
  cave[i] = new Array(maxCol - minCol + 1).fill(".");
}

for (let sc of wallScans) {
  for (let i = 1; i < sc.length; i++) {
    draw(sc[i - 1], sc[i]);
  }
}
cave[0][500 - minCol] = "+";

let maxSteps = 0;
for (let i = 0; i < 2500; i++) {
  let res = fallSand();
  if (res) {
    maxSteps = i;
    // fallSand(true);
    break;
  }
}

function printCave() {
  for (let i = 0; i < cave.length; i++) {
    console.log((i + " ").padStart(5) + cave[i].join(""));
  }
}

function draw(start, end) {
  const [startCol, startRow] = start.split(",").map((n) => parseInt(n));
  const [endCol, endRow] = end.split(",").map((n) => parseInt(n));
  //   console.log("DRAW FROM:", startCol, startRow, "TO", endCol, endRow);
  if (startRow === endRow) {
    // console.log("DRAW HORIZONTAL", startRow, "FROM", startCol, "TO", endCol);
    for (
      let i = Math.min(startCol, endCol);
      i <= Math.max(startCol, endCol);
      i++
    ) {
      cave[startRow][i - minCol] = "#";
    }
  } else {
    // console.log("DRAW VERTICAL COL:", startCol, "FROM", startRow, "TO", endRow);
    for (
      let i = Math.min(startRow, endRow);
      i <= Math.max(endRow, startRow);
      i++
    ) {
      cave[i][startCol - minCol] = "#";
    }
  }
}

function fallSand(printPath = false) {
  let sand = { col: 500 - minCol, row: 0 };
  while (true) {
    if (sand.row === maxRow) {
      printCave();
      return true;
    }

    let nextPos = cave[sand.row + 1][sand.col];
    // console.log(sand.col, sand.col + minCol, sand.row, nextPos);

    if (nextPos === ".") {
      sand.row++;
      if (printPath) {
        cave[sand.row][sand.col] = "~";
      }
    } else if (nextPos === "#" || nextPos === "O") {
      // cannot go down
      if (cave[sand.row + 1][sand.col - 1] === ".") {
        sand.col--;
        sand.row++;
        if (printPath) {
          cave[sand.row][sand.col] = "~";
        }
      } else if (cave[sand.row + 1][sand.col + 1] === ".") {
        sand.col++;
        sand.row++;
        if (printPath) {
          cave[sand.row][sand.col] = "~";
        }
      } else {
        cave[sand.row][sand.col] = "O";
        if (sand.row === 0 && sand.col === 500 - minCol) {
          //can't fit any more sand
          console.log("DONE");
          return true;
        }
        // printCave();
        break;
      }
    }
    // printCave();
  }
  return false;
}
// printCave();
// console.log(wallScans);

cave.push(new Array(maxCol - minCol + 1).fill("."));
cave.push(new Array(maxCol - minCol + 1).fill("#"));

let maxSteps2 = 0;
maxRow += 5;
while (true) {
  maxSteps2++;
  if (fallSand()) {
    break;
  }
}
printCave();
console.log("part 1 ---", maxSteps);

console.log("part 2 ---", maxSteps2, maxSteps2 + maxSteps);
