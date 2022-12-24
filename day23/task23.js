import { readDataAsMap } from "../common/index.js";
// parse input
const map = readDataAsMap("day23/input_test.txt");

drawMap(map);

function drawMap(map) {
  for (const line of map) {
    console.log(line.join(""));
  }
}
function get(map, x, y) {
  if (x < 0 || x >= map.length || y < 0 || y >= map[0].length) {
    return undefined;
  }
  return map[x][y];
}

function proposePosition(map, x, y) {
  const value = map[x][y];
  if (value !== "#") {
    return null;
  }

  let ne = get(map, x - 1, y - 1);
  let nw = get(map, x - 1, y + 1);
  let n = get(map, x - 1, y);
  let se = get(map, x + 1, y - 1);
  let sw = get(map, x + 1, y + 1);
  let s = get(map, x + 1, y);
  let e = get(map, x, y - 1);
  let w = get(map, x, y + 1);
}
