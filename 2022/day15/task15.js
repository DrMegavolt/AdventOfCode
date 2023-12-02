import { readDataLines } from "../common/index.js";
// parse input
const lines = readDataLines("day15/input_test.txt");

let data = [];
let map = new Map();
let takenRanges = new Map();
// let targetLine = 2000000;
let targetLine = 10;
for (let line of lines) {
  let [x1, y1, x2, y2] = line.match(/(-?\d+)/g).map((n) => parseInt(n));
  data.push([x1, y1, x2, y2]);
  map.set(`${x1},${y1}`, "S");
  map.set(`${x2},${y2}`, "B");
  console.log(x1, y1, x2, y2);
}

for (let [x1, y1, x2, y2] of data) {
  console.log("PROCESSING", x1, y1, x2, y2);
  let radius = manhattanDistance(x1, y1, x2, y2);
  let t = 0;
  for (let i = 0; i <= radius; i++) {
    if (y1 - (radius - i) === targetLine) {
      let r1 = takenRanges.get(y1 - (radius - i));
      if (r1) {
        r1.push([x1 - i, x1 + i]);
      } else {
        takenRanges.set(y1 - (radius - i), [[x1 - i, x1 + i]]);
      }
    }

    if (y1 + (radius - i) === targetLine) {
      let r2 = takenRanges.get(y1 + (radius - i));
      if (r2) {
        r2.push([x1 - i, x1 + i]);
      } else {
        takenRanges.set(y1 + (radius - i), [[x1 - i, x1 + i]]);
      }
    }

    // console.log(p1, p2, p3, p4);
  }
  console.log(takenRanges.size);
}
console.log("PROCESSING DONE");

let unavailableSpots = 0;

console.log(takenRanges.get(targetLine));
let ranges = takenRanges.get(targetLine).sort((a, b) => {
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
  if (r[1] >= nextRange[0]) {
    r[1] = Math.max(r[1], nextRange[1]);
  } else {
    mergedRanges.push(r);
    r = nextRange;
  }
}
mergedRanges.push(r);
console.log(mergedRanges);

let row = [...map.keys()]
  .map((key) => {
    let [x, y] = key.split(",").map((n) => parseInt(n));
    return [x, y];
  })
  .filter(([x, y]) => {
    return y === targetLine;
  })
  .map(([x, y]) => {
    return x;
  });

console.log("AAAA", mergedRanges);
unavailableSpots = mergedRanges.reduce((acc, range) => {
  let count = acc + range[1] - range[0] + 1;
  let delta = row.filter((x) => {
    return x >= range[0] && x <= range[1];
  });
  console.log("TAKEN SPOTS IN RANGE", range, delta, delta.length);
  return count - delta.length;
}, 0);

console.log("part 1 ---", unavailableSpots);

console.log("part 2 ---", "TODO");

function manhattanDistance(x1, y1, x2, y2) {
  return Math.abs(x1 - x2) + Math.abs(y1 - y2);
}
