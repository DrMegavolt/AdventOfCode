import { readDataAsFieldMap } from "../common/index.js";
// parse input
const map = readDataAsFieldMap("day23/input.txt");
map.print();
function isValid(destinations) {
  if (destinations.indexOf("#") !== -1) {
    return false;
  }
  return true;
}

function proposePosition(map, x, y, priority) {
  const value = map.get(x, y);
  if (value !== "#") {
    return null;
  }
  let n = map.get(x - 1, y);
  let s = map.get(x + 1, y);
  let w = map.get(x, y - 1);
  let nw = map.get(x - 1, y - 1);
  let sw = map.get(x + 1, y - 1);

  let e = map.get(x, y + 1);
  let ne = map.get(x - 1, y + 1);
  let se = map.get(x + 1, y + 1);

  //   console.log([ne, nw, n, se, value, sw, s, e, w]);
  if ([ne, nw, n, se, sw, s, e, w].indexOf("#") === -1) {
    return null; // stay put, no neighbours
  }

  let elf = [x, y];
  let moves = [null, null, null, null];

  if (isValid([n, ne, nw])) {
    moves[0] = [x - 1, y]; // propose to move north
  }
  if (isValid([s, se, sw])) {
    moves[1] = [x + 1, y]; // propose to move south
  }
  if (isValid([w, nw, sw])) {
    moves[2] = [x, y - 1]; // propose to move west
  }
  if (isValid([e, ne, se])) {
    moves[3] = [x, y + 1]; // propose to move east
  }
  let move = null;
  //   console.log(priority, x, y, moves);
  for (let p = priority; p < priority + 4; p++) {
    move = moves[p % 4];
    if (move) {
      //   console.log(elf, move, moves, p, priority);
      return { elf, move };
    }
  }

  return null;
}

let noMoveRound = -1;
let priority = 0;
// while (true) {
for (let i = 0; i < 10000; i++) {
  let propositions = new Map();
  for (let x = map.minX; x <= map.maxX; x++) {
    for (let y = map.minY; y <= map.maxY; y++) {
      let p = proposePosition(map, x, y, priority);

      if (p) {
        let key = p.move.join(",");
        let contenders = propositions.get(key) || [];
        contenders.push(p.elf);
        propositions.set(key, contenders);
      }
    }
  }
  for (let [move, contenders] of propositions) {
    // console.log(move, contenders);
    if (contenders.length > 1) {
      //   console.log("Collision", contenders);
      continue;
    }

    let [x, y] = move.split(",").map((x) => parseInt(x));
    map.set(x, y, "#");
    map.set(contenders[0][0], contenders[0][1], ".");
  }
  console.log("------------------", i, map.maxX, map.minX, map.maxY, map.minY);
  //   map.print();

  priority++;
  if (propositions.size === 0) {
    noMoveRound = i;
    break;
  }
}

function countEmptyGroundNearElfs(map) {
  let count = 0;
  let minYStart = Number.MAX_SAFE_INTEGER;
  let minXStart = Number.MAX_SAFE_INTEGER;
  let maxYEnd = Number.MIN_SAFE_INTEGER;
  let maxXEnd = Number.MIN_SAFE_INTEGER;

  for (let [k, v] of map) {
    if (v === "#") {
      let [x, y] = k.split(",").map((x) => parseInt(x));
      minXStart = Math.min(minXStart, x);
      minYStart = Math.min(minYStart, y);
      maxXEnd = Math.max(maxXEnd, x);
      maxYEnd = Math.max(maxYEnd, y);
    }
  }

  console.log(minYStart, maxYEnd);
  for (let x = minXStart; x <= maxXEnd; x++) {
    for (let y = minYStart; y <= maxYEnd; y++) {
      if (map.get(x, y) === "#") {
        continue;
      } else {
        count++;
      }
    }
  }

  return count;
}
let c = countEmptyGroundNearElfs(map);
console.log("PART 1", c);
console.log("PART 2", noMoveRound + 1);
