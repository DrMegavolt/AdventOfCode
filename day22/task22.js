import { readDataLines } from "../common/index.js";
// parse input
const lines = readDataLines("day22/input.txt");

let instructions = lines.pop();
lines.pop(); // empty line
let debug = true;
let map = [];
for (let line of lines) {
  let l = [...line].map((c) => (c === " " ? undefined : c));
  //   l.unshift(undefined);
  map.push(l);
}

// instructions= 10R5L5R10L4R5L5
// split instructions into array 10 R 5 L 5 R 10 L 4 R 5 L 5
instructions = instructions
  .split(/(\d+)/)
  .filter((x) => x !== "")
  .map((x) => (x === "L" || x === "R" ? x : parseInt(x)));

console.log(instructions);
// console.log(map);

function drawMap(map, emptyChar = " ", posX = 0, posY = 0, direction = 0) {
  if (!debug) {
    return;
  }
  console.log("--------------------");
  for (let row = 0; row < map.length; row++) {
    if (row < posX - 2 || row > posX + 2) {
      // limit to 5 rows
      continue;
    }
    // limit to 3 rows
    let line = map[row];

    let directionChar =
      direction === 0
        ? ">"
        : direction === 1
        ? "v"
        : direction === 2
        ? "<"
        : "^";
    console.log(
      "ROW:",
      row,
      line
        .map((c, y) => {
          return c === undefined
            ? emptyChar
            : posX === row && posY === y // current position
            ? directionChar
            : c;
        })
        .join("")
    );
  }
}

// initial position
// Facing is 0 for right (>), 1 for down (v), 2 for left (<), and 3 for up (^).
let direction = 0; // right

// find start position
let x = 0;
let y = map[0].indexOf(".");
console.log("START", x, y);
drawMap(map, " ", x, y);

for (let instr of instructions) {
  if (typeof instr === "number") {
    console.log("MOVE", instr);
    let keepMoving = true;
    for (let steps = 0; steps < instr; steps++) {
      console.log("------ instr: ", instr, " steps: ", steps);
      [x, y, keepMoving] = moveOne(x, y, direction);

      if (!keepMoving) {
        break;
      }
    }
    drawMap(map, " ", x, y, direction);
  }

  if (instr === "R") {
    console.log("turn clockwise: R");
    direction = (direction + 1) % 4; // turn right 90°
    drawMap(map, " ", x, y, direction);
  }
  if (instr === "L") {
    console.log("turn counter-clockwise: L");
    direction = (direction + 3) % 4; // turn left 90°
    drawMap(map, " ", x, y, direction);
  }
}

function moveOne(x, y, direction) {
  console.log("moveOne", x, y, direction);
  let newX = x;
  let newY = y;

  switch (direction) {
    case 0: // right
      newY++;
      break;
    case 1: // down
      newX++;
      break;
    case 2: // left
      newY--;
      break;
    case 3: // up
      newX--;
      break;
  }
  if (map[newX] === undefined || map[newX][newY] === undefined) {
    console.log("out of bounds");
    // search for map wrap
    if (direction === 0) {
      // right
      let nextWall = map[newX].indexOf("#");
      let nextFreePos = map[newX].indexOf(".");
      if (nextWall < nextFreePos) {
        return [x, y, false]; // hit wall stay here
      } else {
        // wrap
        newY = 0;
        return [newX, newY, true];
      }
    }
    if (direction === 1) {
      // down
      for (let row = 0; row < map.length; row++) {
        let line = map[row];
        if (line[y] === "#") {
          return [x, y, false]; // hit wall stay here
        }
        if (line[y] === ".") {
          newX = row;
          return [newX, newY, true]; // wrap, continue
        }
      }
    }
    if (direction === 2) {
      // left
      let nextWall = map[newX].lastIndexOf("#");
      let nextFreePos = map[newX].lastIndexOf(".");
      if (nextWall > nextFreePos) {
        return [x, y, false]; // hit wall stay here
      } else {
        // wrap
        newY = map[0].length - 1;
        return [newX, newY, true];
      }
    }
    if (direction === 3) {
      // up
      for (let row = map.length - 1; row >= 0; row--) {
        let line = map[row];
        if (line[y] === "#") {
          return [x, y, false]; // hit wall stay here
        }
        if (line[y] === ".") {
          newX = row;
          return [newX, newY, true]; // wrap, continue
        }
      }
    }
  }
  if (map[newX][newY] === "#") {
    // console.log("hit wall");
    return [x, y, false];
  }

  return [newX, newY, true];
}

console.log(
  "PART 1: ",
  1000 * (x + 1) + 4 * (y + 1) + direction,
  x,
  y,
  direction
);
