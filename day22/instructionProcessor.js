export function processInstruction({
  map,
  instr,
  x,
  y,
  direction,
  debug,
  is3D,
}) {
  if (typeof instr === "number") {
    debug && console.log("MOVE", instr);
    let keepMoving = true;
    for (let steps = 0; steps < instr; steps++) {
      debug && console.log("------ instr: ", instr, " steps: ", steps);
      [x, y, keepMoving, direction] = moveOne({ map, x, y, direction, is3D });

      if (!keepMoving) {
        // console.log("BREAK", x, y, keepMoving, steps, instr, direction);
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
function wrap({ map, x, y, direction, newX, newY }) {
  if (direction === 0) {
    // right
    let nextWall = Math.max(map[newX].indexOf("#"), 0);
    let nextFreePos = map[newX].indexOf(".");
    if (nextWall < nextFreePos) {
      // console.log("HIT WALL RIGHT", nextWall, nextFreePos);
      return [x, y, false]; // hit wall stay here
    } else {
      // wrap
      newY = nextFreePos;
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
function validateMove({ map, x, y, direction, newX, newY, newDirection }) {
  if (map[newX][newY] === "#") {
    return [x, y, false, direction];
  } else {
    return [newX, newY, true, newDirection];
  }
}

function wrap3D({ map, x, y, direction, newX, newY }) {
  console.log("wrap3D", x, y, direction, newX, newY);
  let newDirection = direction;
  let plane = identifyPlane(map, { x, y });
  if (direction === 0) {
    // right
    // RIGHT side of the RIGHT plane is the flipped RIGHT side of the BOTTOM plane
    // x=10, y=149 -> x=140, y=99 dir left
    if (plane === "RIGHT") {
      newY = 99;
      newX = 150 - newX;
      newDirection = 2;
      return validateMove({ map, x, y, direction, newX, newY, newDirection });
    }
    // RIGHT side of the FRONT plane is the BOTTOM side of the RIGHT plane
    // x=90, y=100 -> x=49 y=140 dir up
    if (plane === "FRONT") {
      newY = 50 + newX;
      newX = 49;
      newDirection = 3;
      return validateMove({ map, x, y, direction, newX, newY, newDirection });
    }

    // RIGHT side of the BOTTOM plane is the RIGHT side of the FRONT plane
    // x=140, y=99 -> x=10, y=149 dir left
    if (plane === "BOTTOM") {
      newY = 149;
      newX = 150 - newX;
      newDirection = 2;
      return validateMove({ map, x, y, direction, newX, newY, newDirection });
    }

    // RIGHT side of the BACK plane is the BOTTOM side of the BOTTOM plane
    // x=160, y=49 -> x=149, y=60 dir up
    if (plane === "BACK") {
      newY = newX - 100;
      newX = 149;
      newDirection = 3;
      return validateMove({ map, x, y, direction, newX, newY, newDirection });
    }
  }
  if (direction === 1) {
    // down
    // BOTTOM side of the BACK plane is the TOP side of the RIGHT plane
    // x=199, y=40 -> x=0, y=140 dir down
    if (plane === "BACK") {
      newY = 100 + newY;
      newX = 0;
      newDirection = 1;
      return validateMove({ map, x, y, direction, newX, newY, newDirection });
    }

    // BOTTOM side of the BOTTOM plane is the RIGHT side of the BACK plane
    // x=149, y=60 -> x=160, y=49 dir left
    if (plane === "BOTTOM") {
      newX = 100 + newY;
      newY = 49;
      newDirection = 2; // left
      return validateMove({ map, x, y, direction, newX, newY, newDirection });
    }

    // BOTTOM side of the RIGHT plane is the RIGHT side of the FRONT plane
    // x=49, y=140 -> x=90, y=99 dir left
    if (plane === "RIGHT") {
      newX = newY - 50;
      newY = 99;
      newDirection = 2; // left
      return validateMove({ map, x, y, direction, newX, newY, newDirection });
    }
  }
  if (direction === 2) {
    // left
    // LEFT side of FRONT plane is the top of the LEFT plane
    // FRONT x = 50, y = 90 -> LEFT x = 100, y = 40 (90-50) dir down
    if (plane === "FRONT") {
      newY = newX - 50;
      newX = 100;
      newDirection = 1;
      return validateMove({ map, x, y, direction, newX, newY, newDirection });
    }
    // LEFT side of the TOP plane is the flipped LEFT side of the LEFT plane
    // x=40, y=50 -> x=110, y=0 dir right
    if (plane === "TOP") {
      newX = 150 - newX;
      newY = 0;
      newDirection = 0;
      return validateMove({ map, x, y, direction, newX, newY, newDirection });
    }
    // LEFT side of the LEFT plane is the flipped LEFT side of the TOP plane
    // x=110, y=0 -> x=40, y=50 dir right
    if (plane === "LEFT") {
      newY = 50;
      newX = 150 - newX;
      newDirection = 0;
      return validateMove({ map, x, y, direction, newX, newY, newDirection });
    }
    // LEFT side of the BACK plane is the flipped LEFT side of the TOP plane
    // x=190, y=0 -> x=0,y=90 dir down
    if (plane === "BACK") {
      newY = newX - 100;
      newX = 0;
      newDirection = 1;
      return validateMove({ map, x, y, direction, newX, newY, newDirection });
    }
  }
  if (direction === 3) {
    // up
    // TOP side of the LEFT plane is the flipped RIGHT side of the FRONT plane
    // x=100 y=40 -> x=60 y=50 dir right
    if (plane === "LEFT") {
      newX = 100 - newY;
      newY = 50;
      newDirection = 0;
      return validateMove({ map, x, y, direction, newX, newY, newDirection });
    }

    // TOP side of the TOP plane is the flipped LEFT side of the BACK plane
    // x=0, y=90 -> x=190, y=0 dir right
    if (plane === "TOP") {
      newX = 100 + newY;
      newY = 0;
      newDirection = 0;
      return validateMove({ map, x, y, direction, newX, newY, newDirection });
    }

    // TOP side of the RIGHT plane is the flipped BOTTOM side of the BACK plane
    // x=0, y=140 -> x=199, y=40 dir up
    if (plane === "RIGHT") {
      newY = newY - 100;
      newX = 199;
      newDirection = 3;
      return validateMove({ map, x, y, direction, newX, newY, newDirection });
    }
  }
  // return [x, y, false, direction];
  throw new Error("Not implemented");
}

function moveOne({ map, x, y, direction, debug, is3D }) {
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
    if (is3D) {
      return wrap3D({ map, x, y, direction, newX, newY });
    }
    return [...wrap({ map, x, y, direction, newX, newY }), direction];
  }
  if (map[newX][newY] === "#") {
    // console.log("hit wall");
    return [x, y, false, direction];
  }

  return [newX, newY, true, direction];
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

export function identifyPlane(map, { x, y }) {
  if (map[x][y] === undefined) {
    throw new Error("Invalid position");
  }
  if (x >= 0 && x <= 49 && y >= 50 && y <= 99) {
    return "TOP";
  }
  if (x >= 0 && x <= 49 && y >= 100 && y <= 149) {
    return "RIGHT";
  }
  if (x >= 50 && x <= 99 && y >= 50 && y <= 99) {
    return "FRONT";
  }
  if (x >= 100 && x <= 149 && y >= 50 && y <= 99) {
    return "BOTTOM"; //  plane
  }
  if (x >= 100 && x <= 149 && y >= 0 && y <= 49) {
    return "LEFT";
  }
  if (x >= 150 && x <= 199 && y >= 0 && y <= 49) {
    return "BACK";
  }
}
