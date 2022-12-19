import { readFileSync } from "fs";
const input = readFileSync("./input.txt", "utf8");
// parse input
const lines = input.split("\n");
let commands = [];
for (let i = 0; i < lines.length; i++) {
  commands.push(lines[i].split(" "));
}
let H = { x: 0, y: 0 };
let T = { x: 0, y: 0 };
let visited = new Set();
for (let c of commands) {
  let [command, count] = c;
  count = parseInt(count);
  for (let i = 0; i < count; i++) {
    switch (command) {
      case "U":
        H.y--;
        break;
      case "D":
        H.y++;
        break;
      case "L":
        H.x--;
        break;
      case "R":
        H.x++;
        break;
    }
    followHead(H, T);
    // console.log("H=", H);
    // console.log("T=", T);
    visited.add(`${T.x},${T.y}`);
  }
}

function followHead(head, tail) {
  let x = head.x - tail.x;
  let y = head.y - tail.y;

  // head is touching tail
  if (Math.abs(x) <= 1 && Math.abs(y) <= 1) {
    return;
  }

  // 2 steps to the right
  if (x == 2 && y == 0) {
    tail.x++;
    return;
  }
  // 2 steps to the left
  if (x == -2 && y == 0) {
    tail.x--;
    return;
  }

  // 2 steps up
  if (x == 0 && y == -2) {
    tail.y--;
    return;
  }
  // 2 steps down
  if (x == 0 && y == 2) {
    tail.y++;
    return;
  }

  // tail too far away, move diagonally closer
  tail.x += Math.abs(x) / x; // 1 or -1
  tail.y += Math.abs(y) / y; // 1 or -1
}

console.log("part 1 answer", visited.size);

function visualizePath(visited) {
  let minx = 0;
  let miny = 0;
  let maxx = 0;
  let maxy = 0;
  for (let v of visited) {
    let [x, y] = v.split(",");
    x = parseInt(x);
    y = parseInt(y);
    if (x < minx) minx = x;
    if (x > maxx) maxx = x;
    if (y < miny) miny = y;
    if (y > maxy) maxy = y;
  }
  let w = maxx - minx + 1;
  let h = maxy - miny + 1;
  let forest = [];
  for (let i = 0; i < h; i++) {
    forest.push([]);
    for (let j = 0; j < w; j++) {
      forest[i].push(".");
    }
  }
  for (let v of visited) {
    let [x, y] = v.split(",");
    x = parseInt(x);
    y = parseInt(y);
    forest[y - miny][x - minx] = "#";
  }
  for (let i = 0; i < h; i++) {
    console.log(forest[i].join(""));
  }
}
// visualizePath(visited);

// answer: 6067
