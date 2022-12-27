import { readDataLines } from "../common/index.js";
import { processInstruction, drawMap } from "./instructionProcessor.js";
// parse input
const lines = readDataLines("day22/input.txt");

let instructions = lines.pop();
lines.pop(); // empty line
let debug = false;
let map = [];
for (let line of lines) {
  let l = [...line].map((c) => (c === " " ? undefined : c));
  //   l.unshift(undefined);
  map.push(l);
}

// instructions= 10R5L5R10L4R5L5
// split instructions into array 10 R 5 L 5 R 10 L 4 R 5 L 5
let test = instructions;
instructions = instructions
  .split(/(\d+)/)
  .filter((x) => x !== "")
  .map((x) => (x === "L" || x === "R" ? x : parseInt(x)));

console.log(instructions);

if (instructions.join("") !== test) {
  throw new Error("Invalid instructions");
}
// console.log(map);

// initial position
// Facing is 0 for right (>), 1 for down (v), 2 for left (<), and 3 for up (^).
let direction = 0; // right

// find start position
let x = 0;
let y = map[0].indexOf(".");
console.log("START", x, y);
drawMap(map, " ", x, y);

for (let instr of instructions) {
  [x, y, direction] = processInstruction({ map, instr, x, y, direction });
  if (map[x][y] !== ".") {
    console.log("Invalid position", instr, x, y, map[x][y], direction);
    // drawMap(map, " ", x, y, direction);
    throw new Error("Invalid position");
  }
}

//159034
let part1 = 1000 * (x + 1) + 4 * (y + 1) + direction;
if (part1 !== 159034) {
  throw new Error("Invalid part 1");
}
console.log("PART 1: ", part1, x, y, direction);

x = 0;
y = map[0].indexOf(".");
direction = 0;
for (let instr of instructions) {
  [x, y, direction] = processInstruction({
    map,
    instr,
    x,
    y,
    direction,
    is3D: true,
  });
  if (map[x][y] !== ".") {
    console.log("Invalid position", instr, x, y, map[x][y], direction);
    // drawMap(map, " ", x, y, direction);
    throw new Error("Invalid position");
  }
}
console.log(
  "PART 2: ",
  1000 * (x + 1) + 4 * (y + 1) + direction,
  x,
  y,
  direction
);
