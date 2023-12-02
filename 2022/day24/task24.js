import { readDataAsFieldMap, FieldMap } from "../common/index.js";
// parse input
const map = readDataAsFieldMap("day24/input.txt");

map.print();

let startTop = { x: 0, y: 1 };
let endBottom = { x: map.maxX - 1, y: map.maxY - 1 };
let startBottom = { x: map.maxX, y: map.maxY - 1 };
let endTop = { x: 1, y: 1 };
console.log(startTop, endBottom);
// map.set(start.x, start.y, "S");
// map.set(end.x, end.y, "E");

map.print();
let blizzards = [];
for (let x = 1; x < map.maxX; x++) {
  for (let y = 1; y < map.maxY; y++) {
    let v = map.get(x, y);
    if (v === ".") {
      continue;
    }
    blizzards.push({ x, y, direction: v });
  }
}
console.log("blizzards", blizzards);

function moveBlizzards(blizzards, map) {
  //direction: up (^), down (v), left (<), or right (>).
  let entries = [...map];
  entries = entries.map(([k, v]) => {
    if (v !== "#") {
      // clear <>^v Z from the map
      return [k, "."];
    }
    return [k, v];
  });
  let map2 = new FieldMap(entries);
  map2.unlimited = false;
  let blizzards2 = [];
  for (let blizzard of blizzards) {
    let { x, y, direction } = blizzard;
    let newX = x;
    let newY = y;
    switch (direction) {
      case "^":
        newX--;
        break;
      case "v":
        newX++;
        break;
      case "<":
        newY--;
        break;
      case ">":
        newY++;
        break;
    }
    let v = map2.get(newX, newY);
    if (v === "#") {
      // hit the wall, respawn from the other side
      switch (direction) {
        case "^":
          newX = map2.maxX - 1;
          break;
        case "v":
          newX = 1;
          break;
        case "<":
          newY = map2.maxY - 1;
          break;
        case ">":
          newY = 1;
          break;
      }
    }
    blizzards2.push({ x: newX, y: newY, direction });
    let cell = map2.get(newX, newY);
    if (cell === ".") {
      map2.set(newX, newY, direction);
    } else {
      map2.set(newX, newY, "Z");
    }
  }
  return { map: map2, blizzards: blizzards2 };
}
let w = map.maxX - 1;
let h = map.maxY - 1;
let numberOfDistinctBlizzards = w === h ? w : w * h;

let map2 = map;
let blizzards2 = blizzards;

let maps = [];
for (let i = 0; i < numberOfDistinctBlizzards; i++) {
  map2.unlimited = false; // do not allow to go outside the map
  maps.push(map2);
  let r = moveBlizzards(blizzards2, map2);
  map2 = r.map;
  blizzards2 = r.blizzards;
}

function bfs(start, end, initialStep = 1) {
  let maxSteps = 1500;
  function score(queueEntry) {
    let [x, y, step] = queueEntry;
    let distance = Math.abs(end.x - x) / end.x + Math.abs(end.y - y) / end.y;
    return distance + step / maxSteps;
  }
  function compare(a, b) {
    return score(a) - score(b);
  }
  let queue = [[start.x, start.y, initialStep]];
  let counter = 0;
  let enqued = new Set();
  let add = ([x, y, step]) => {
    if (enqued.has(`${x},${y},${step}`)) {
      return;
    }
    if (step + Math.abs(end.x - x) + Math.abs(end.y - y) >= maxSteps - 1) {
      return;
    }
    enqued.add(`${x},${y},${step}`);
    queue.push([x, y, step]);
  };
  while (true) {
    counter++;
    let qe = queue.shift();
    if (!qe) {
      console.log("finished");
      return maxSteps;
    }
    let [x, y, step] = qe;
    // enqued.delete(`${x},${y},${step}`);

    counter % 50000 === 0 &&
      console.log(qe, maxSteps, score(qe), queue.length, enqued.size);

    if (x === end.x && y === end.y) {
      console.log("FOUND", x, y, step);
      maxSteps = step;
      queue = queue.filter(([x, y, step]) => {
        return step + Math.abs(end.x - x) + Math.abs(end.y - y) < maxSteps;
      });
    }

    // map at the next step
    let nextStep = step + 1;
    let m = maps[nextStep % numberOfDistinctBlizzards];

    let u = m.get(x + 1, y);
    let d = m.get(x - 1, y);
    let l = m.get(x, y - 1);
    let r = m.get(x, y + 1);
    let stay = m.get(x, y);

    if (u === ".") {
      add([x + 1, y, nextStep]);
    }
    if (d === ".") {
      add([x - 1, y, nextStep]);
    }
    if (l === ".") {
      add([x, y - 1, nextStep]);
    }
    if (r === ".") {
      add([x, y + 1, nextStep]);
    }
    if (stay === ".") {
      add([x, y, nextStep]);
    }
    if (counter % 1000 === 0) {
      queue.sort(compare);
    }
    // console.log(queue.map(([x, y, step]) => step).slice(0, 10));
  }
}
let r = bfs(startTop, endBottom, 1);
let part1 = r + 1; // because we need to go inside exit wall
// let r = bfs(endTop, startBottom);
console.log("PART 1= ", part1); // 264 is the answer

let r2 = bfs(startBottom, endTop, part1);
let part2_1 = r2 + 1; // because we need to go inside entrance wall
console.log("PART 2=", part2_1);

let r3 = bfs(startTop, endBottom, part2_1);
let part2_2 = r3 + 1; // because we need to go inside exit wall
console.log("PART 2=", part2_2); // 789 is the answer
