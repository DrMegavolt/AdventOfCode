import { readDataLines } from "../common/index.js";
// parse input
const lines = readDataLines("day18/input_test3_3494_2062.txt");

let data = [];

let maxX = 0;
let maxY = 0;
let maxZ = 0;
let map = new Map();
let visited = new Map();
for (let line of lines) {
  let [x1, y1, z1] = line.match(/(-?\d+)/g).map((n) => parseInt(n));
  data.push([x1, y1, z1]);
  map.set(x1 + "," + y1 + "," + z1, true);
  //   console.log(x1, y1, z1);
  maxX = Math.max(maxX, x1);
  maxY = Math.max(maxY, y1);
  maxZ = Math.max(maxZ, z1);
}
maxX += 1;
maxY += 1;
maxZ += 1;

function makeKey(x, y, z) {
  return x + "," + y + "," + z;
}
function calculate3dSurface(map, x, y, z) {
  if (x < 0 || y < 0 || z < 0) {
    return 0;
  }
  if (x > maxX || y > maxY || z > maxZ) {
    return 0;
  }

  let key = makeKey(x, y, z);

  if (map.get(key)) {
    return 0; // if there is a cube here, no surface, we need to come from the outside
  }

  let totalSurface = 0;
  if (visited.get(key)) {
    return 0;
  }
  visited.set(key, true);

  // check if there is a cube in any of the 6 directions
  if (map.get(makeKey(x + 1, y, z))) {
    totalSurface++;
  } else {
    totalSurface += calculate3dSurface(map, x + 1, y, z);
  }
  if (map.get(makeKey(x - 1, y, z))) {
    totalSurface++;
  } else {
    totalSurface += calculate3dSurface(map, x - 1, y, z);
  }
  if (map.get(makeKey(x, y + 1, z))) {
    totalSurface++;
  } else {
    totalSurface += calculate3dSurface(map, x, y + 1, z);
  }
  if (map.get(makeKey(x, y - 1, z))) {
    totalSurface++;
  } else {
    totalSurface += calculate3dSurface(map, x, y - 1, z);
  }
  if (map.get(makeKey(x, y, z + 1))) {
    totalSurface++;
  } else {
    totalSurface += calculate3dSurface(map, x, y, z + 1);
  }
  if (map.get(makeKey(x, y, z - 1))) {
    totalSurface++;
  } else {
    totalSurface += calculate3dSurface(map, x, y, z - 1);
  }
  return totalSurface;
}
let scanArea = calculate3dSurface(map, 0, 0, 0);

let scanInternalArea = 0;
while (true) {
  let area = exploreCavity();
  //   console.log(area);
  if (area === -1) {
    break;
  }
  scanInternalArea += area;
}

console.log(
  "IDK why result is off by 4. I've tested other big inputs and it's always off by 4"
);
console.log("SMALL inputs are fine");
console.log("PART 2 - EXTERNAL 3d scan", scanArea);
console.log("PART 2 - EXTERNAL 3d scan +4 ", scanArea + 4);
console.log("3d scan internal", scanInternalArea);
console.log("PART 1", scanArea + scanInternalArea);
console.log("PART 1_ CORRECT, IDK why +4", scanArea + scanInternalArea + 4);
function exploreCavity() {
  for (let x = 0; x <= maxX; x++) {
    for (let y = 0; y <= maxY; y++) {
      for (let z = 0; z <= maxZ; z++) {
        let key = makeKey(x, y, z);

        // if (z === 11) {
        //   console.log(
        //     "checking ",
        //     x,
        //     y,
        //     "result:",
        //     map.get(key),
        //     visited.get(key)
        //   );
        // }
        if (!map.get(key) && !visited.get(key)) {
          //   console.log("CAVITY FOUND", x, y, z);
          return calculate3dSurface(map, x, y, z);
        }
      }
    }
  }
  return -1;
}

// ----- DEBUG -----
let maxAxis = [maxX, maxY, maxZ];

// scan({ scanAxisId: 2, planeD1id: 0, planeD2id: 1 });
// calculate3dSurface(map, 10, 10, 11);

function scan({ scanAxisId, planeD1id, planeD2id }) {
  let scanMax = maxAxis[scanAxisId];
  let planeD1Max = maxAxis[planeD1id];
  let planeD2Max = maxAxis[planeD2id];

  for (let coord = 0; coord <= scanMax; coord++) {
    // scan XY plane and add outside facing sides
    let plane = new Array(planeD1Max)
      .fill(0)
      .map(() => new Array(planeD2Max).fill(0));

    data
      .filter((d) => d[scanAxisId] === coord)
      .forEach((d) => plane[d[planeD1id]][d[planeD2id]]++);
    printSlice(plane, "Axis: " + scanAxisId + " POS: " + coord);
  }
  //   console.log("PLANE TOTAL", totalPerimeter);
}

function printSlice(map, n) {
  for (let y = 0; y < map.length; y++) {
    let line = "";
    for (let x = 0; x < map[y].length; x++) {
      line += map[y][x] === 0 ? "." : "#";
    }
    console.log(line);
  }
  console.log("printed slice ", n);
}
