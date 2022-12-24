export function processInstruction(map, instr, x, y, direction, debug = false) {
  if (typeof instr === "number") {
    debug && console.log("MOVE", instr);
    let keepMoving = true;
    for (let steps = 0; steps < instr; steps++) {
      debug && console.log("------ instr: ", instr, " steps: ", steps);
      [x, y, keepMoving] = moveOne(map, x, y, direction, debug);

      if (!keepMoving) {
        console.log("BREAK", x, y, keepMoving, steps, instr, direction);
        break;
      }
    }
    debug && drawMap(map, " ", x, y, direction);
  }

  if (instr === "R") {
    // draw && console.log("turn clockwise: R");
    direction = (direction + 1) % 4; // turn right 90°
    debug && drawMap(map, " ", x, y, direction);
  }
  if (instr === "L") {
    // draw && console.log("turn counter-clockwise: L");
    direction = (direction + 3) % 4; // turn left 90°
    debug && drawMap(map, " ", x, y, direction);
  }
  return [x, y, direction];
}
function moveOne(map, x, y, direction, debug = false) {
  debug && console.log("moveOne", x, y, direction);
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
    debug && console.log("out of bounds", newX, newY, direction);
    // search for map wrap
    if (direction === 0) {
      // right
      let nextWall = Math.max(map[newX].indexOf("#"), 0);
      let nextFreePos = map[newX].indexOf(".");
      if (nextWall < nextFreePos) {
        console.log("HIT WALL RIGHT", nextWall, nextFreePos);
        return [x, y, false]; // hit wall stay here
      } else {
        // wrap
        newY = nextFreePos;
        console.log("WRAP RIGHT", newX, newY);
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
      let nextWall = Math.max(map[newX].lastIndexOf("#"), 0);
      let nextFreePos = map[newX].lastIndexOf(".");
      if (nextWall > nextFreePos) {
        return [x, y, false]; // hit wall stay here
      } else {
        // wrap
        newY = nextFreePos;
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
export function drawMap(
  map,
  emptyChar = " ",
  posX = 0,
  posY = 0,
  direction = 0
) {
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
