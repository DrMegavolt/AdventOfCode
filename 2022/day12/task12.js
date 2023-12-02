import { readDataLines } from "../common/index.js";
// parse input
const lines = readDataLines("day12/input.txt");
let map = [];
let start = { x: 0, y: 0 };
let end = { x: 0, y: 0 };
let visited = [];
for (let i = 0; i < lines.length; i++) {
  visited.push(new Array(lines[i].length).fill(Number.MAX_SAFE_INTEGER));
  lines[i].indexOf("S") !== -1 &&
    ((start.x = i), (start.y = lines[i].indexOf("S")));
  lines[i].indexOf("E") !== -1 &&
    ((end.x = i), (end.y = lines[i].indexOf("E")));

  map.push([...lines[i]].map((x) => x.charCodeAt(0) - 97));
}
map[start.x][start.y] = 0;
map[end.x][end.y] = "z".charCodeAt(0) - 97;

function move(x, y, steps, height) {
  if (x < 0 || x >= map.length || y < 0 || y >= map[0].length) {
    return;
  }
  let mH = map[x][y];

  if (mH > height + 1) {
    return; // too high
  }

  if (visited[x][y] <= steps) {
    return; // better path already found
  }

  visited[x][y] = steps;

  move(x + 1, y, steps + 1, mH);
  move(x - 1, y, steps + 1, mH);
  move(x, y + 1, steps + 1, mH);
  move(x, y - 1, steps + 1, mH);
}
move(start.x, start.y, 0, 0);

console.log("part 1 ---", visited[end.x][end.y]);

// part 2
// find all a
let lowestPoints = [];
for (let i = 0; i < map.length; i++) {
  const row = map[i];
  for (let j = 0; j < row.length; j++) {
    if (row[j] === 0) {
      lowestPoints.push({ x: i, y: j });
    }
  }
}
let min = visited[end.x][end.y]; // result from part 1

for (const point of lowestPoints) {
  move(point.x, point.y, 0, 0);
  if (visited[end.x][end.y] < min) {
    min = visited[end.x][end.y];
  }
}
console.log("part 2 ---", min);
