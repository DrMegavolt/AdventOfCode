import { processInstruction, identifyPlane } from "./instructionProcessor.js";
import { readDataLines } from "../common/index.js";

function generateFakeMap() {
  const lines = readDataLines("day22/fake_empty.txt");
  let map = [];
  for (let line of lines) {
    let l = [...line].map((c) => (c === " " ? undefined : c));
    //   l.unshift(undefined);
    map.push(l);
  }
  return map;
}

function directionToChar(dir) {
  switch (dir) {
    case 0:
      return ">";
    case 1:
      return "v";
    case 2:
      return "<";
    case 3:
      return "^";
  }
}

function print(map, range) {
  let s = "";
  for (let i = 0; i < map.length; i++) {
    let line = map[i];
    s +=
      i.toString().padStart(3, " ") +
      " " +
      line.map((c) => (c === undefined ? " " : c)).join("") +
      "\n";
  }
  console.log(s);
}

describe("Moving to the LEFT from FRONT plane", () => {
  let map;
  let dir = 2;
  let start;
  let end;
  beforeEach(() => {
    map = generateFakeMap();
    dir = 2;
  });
  afterEach(() => {
    expect(identifyPlane(map, start)).toBe("FRONT");
    expect(identifyPlane(map, end)).toBe("LEFT");
  });
  it("should wrap in the LEFT plane", () => {
    start = { x: 98, y: 50 };
    end = { x: 100, y: 48, d: 1 };
    map[start.x][start.y] = directionToChar(dir);
    map[end.x][end.y] = directionToChar(end.d);
    // print(map);
    //
    let [x, y, d] = processInstruction({
      map,
      instr: 1,
      x: start.x,
      y: start.y,
      direction: dir,
      is3D: true,
    });

    expect(x).toBe(end.x);
    expect(y).toBe(end.y);
    expect(d).toBe(end.d); // down
  });
  it("should wrap in the LEFT plane and keep moving", () => {
    start = { x: 98, y: 50 };
    end = { x: 109, y: 48, d: 1 };
    map[start.x][start.y] = directionToChar(dir);
    map[end.x][end.y] = directionToChar(end.d);
    // print(map);

    let [x, y, d] = processInstruction({
      map,
      instr: 10,
      x: start.x,
      y: start.y,
      direction: dir,
      is3D: true,
    });

    expect(x).toBe(end.x);
    expect(y).toBe(end.y);
    expect(d).toBe(end.d); // down
  });
  it("should wrap in the LEFT plane and keep moving untill the wall", () => {
    start = { x: 90, y: 60 };
    end = { x: 109, y: 40, d: 1 };
    map[start.x][start.y] = directionToChar(dir);
    map[end.x + 1][end.y] = "#";
    // print(map);

    let [x, y, d] = processInstruction({
      map,
      instr: 100,
      x: start.x,
      y: start.y,
      direction: dir,
      is3D: true,
    });

    expect(x).toBe(end.x);
    expect(y).toBe(end.y);
    expect(d).toBe(end.d); // down
  });
  it("should not wrap in the LEFT plane if next is wall", () => {
    start = { x: 98, y: 50 };
    end = { x: 100, y: 48, d: 1 };
    map[start.x][start.y] = directionToChar(dir);
    map[end.x][end.y] = "#";
    // print(map);

    let [x, y, d] = processInstruction({
      map,
      instr: 1,
      x: start.x,
      y: start.y,
      direction: dir,
      is3D: true,
    });

    expect(x).toBe(start.x);
    expect(y).toBe(start.y);
    expect(d).toBe(dir); // still left
  });
});

describe("Moving to the LEFT from TOP plane", () => {
  let map;
  let dir = 2;
  let start;
  let end;
  beforeEach(() => {
    map = generateFakeMap();
    dir = 2;
  });
  afterEach(() => {
    expect(identifyPlane(map, start)).toBe("TOP");
    expect(identifyPlane(map, end)).toBe("LEFT");
  });
  it("should wrap in the LEFT plane", () => {
    // x=40, y=50 -> x=110, y=0 dir right
    start = { x: 40, y: 50 };
    end = { x: 109, y: 0, d: 0 };
    map[start.x][start.y] = directionToChar(dir);
    map[end.x][end.y] = directionToChar(end.d);
    // print(map);
    let [x, y, d] = processInstruction({
      map,
      instr: 1,
      x: start.x,
      y: start.y,
      direction: dir,
      is3D: true,
    });

    expect(x).toBe(end.x);
    expect(y).toBe(end.y);
    expect(d).toBe(end.d); // right
  });
  it("should wrap in the LEFT plane and keep moving", () => {
    start = { x: 40, y: 50 };
    end = { x: 109, y: 9, d: 0 };
    map[start.x][start.y] = directionToChar(dir);
    map[end.x][end.y] = directionToChar(end.d);
    // print(map);

    let [x, y, d] = processInstruction({
      map,
      instr: 10,
      x: start.x,
      y: start.y,
      direction: dir,
      is3D: true,
    });

    expect(x).toBe(end.x);
    expect(y).toBe(end.y);
    expect(d).toBe(end.d); // right
  });
  it("should wrap in the LEFT plane and keep moving untill the wall", () => {
    start = { x: 40, y: 50 };
    end = { x: 109, y: 9, d: 0 };
    map[start.x][start.y] = directionToChar(dir);
    map[end.x][end.y + 1] = "#";
    // print(map);

    let [x, y, d] = processInstruction({
      map,
      instr: 100,
      x: start.x,
      y: start.y,
      direction: dir,
      is3D: true,
    });

    expect(x).toBe(end.x);
    expect(y).toBe(end.y);
    expect(d).toBe(end.d); // right
  });
  it("should not wrap in the LEFT plane if next is wall", () => {
    start = { x: 40, y: 50 };
    end = { x: 109, y: 0, d: 0 };
    map[start.x][start.y] = directionToChar(dir);
    map[end.x][end.y] = "#";
    // print(map);

    let [x, y, d] = processInstruction({
      map,
      instr: 10,
      x: start.x,
      y: start.y,
      direction: dir,
      is3D: true,
    });

    expect(x).toBe(start.x);
    expect(y).toBe(start.y);
    expect(d).toBe(dir); // still left
  });
});

describe("Moving to the LEFT from LEFT plane", () => {
  let map;
  let dir = 2;
  let start;
  let end;
  beforeEach(() => {
    map = generateFakeMap();
    dir = 2;
  });
  afterEach(() => {
    expect(identifyPlane(map, start)).toBe("LEFT");
    expect(identifyPlane(map, end)).toBe("TOP");
  });
  it("should wrap in the TOP plane", () => {
    // x=110, y=0 -> x=39, y=50 dir right
    start = { x: 110, y: 0 };
    end = { x: 39, y: 50, d: 0 };
    map[start.x][start.y] = directionToChar(dir);
    map[end.x][end.y] = directionToChar(end.d);
    // print(map);

    let [x, y, d] = processInstruction({
      map,
      instr: 1,
      x: start.x,
      y: start.y,
      direction: dir,
      is3D: true,
    });

    expect(x).toBe(end.x);
    expect(y).toBe(end.y);
    expect(d).toBe(end.d); // right
  });
  it("should wrap in the TOP plane and keep moving", () => {
    start = { x: 110, y: 0 };
    end = { x: 39, y: 59, d: 0 };
    map[start.x][start.y] = directionToChar(dir);
    map[end.x][end.y] = directionToChar(end.d);
    // print(map);

    let [x, y, d] = processInstruction({
      map,
      instr: 10,
      x: start.x,
      y: start.y,
      direction: dir,
      is3D: true,
    });

    expect(x).toBe(end.x);
    expect(y).toBe(end.y);
    expect(d).toBe(end.d); // right
  });
  it("should wrap in the TOP plane and keep moving untill the wall", () => {
    start = { x: 110, y: 0 };
    end = { x: 39, y: 59, d: 0 };
    map[start.x][start.y] = directionToChar(dir);
    map[end.x][end.y + 1] = "#";
    // print(map);

    let [x, y, d] = processInstruction({
      map,
      instr: 100,
      x: start.x,
      y: start.y,
      direction: dir,
      is3D: true,
    });

    expect(x).toBe(end.x);
    expect(y).toBe(end.y);
    expect(d).toBe(end.d); // right
  });
  it("should not wrap in the TOP plane if next is wall", () => {
    start = { x: 110, y: 0 };
    end = { x: 39, y: 50, d: 0 };
    map[start.x][start.y] = directionToChar(dir);
    map[end.x][end.y] = "#";
    // print(map);

    let [x, y, d] = processInstruction({
      map,
      instr: 10,
      x: start.x,
      y: start.y,
      direction: dir,
      is3D: true,
    });

    expect(x).toBe(start.x);
    expect(y).toBe(start.y);
    expect(d).toBe(dir); // still left
  });
});

describe("Moving to the LEFT from BACK plane", () => {
  let map;
  let dir = 2;
  let start;
  let end;
  beforeEach(() => {
    map = generateFakeMap();
    dir = 2;
  });
  afterEach(() => {
    expect(identifyPlane(map, start)).toBe("BACK");
    expect(identifyPlane(map, end)).toBe("TOP");
  });
  // x=190, y=0 -> x=0,y=90 dir down
  it("should wrap in the TOP plane", () => {
    start = { x: 189, y: 0 };
    end = { x: 0, y: 89, d: 1 };
    map[start.x][start.y] = directionToChar(dir);
    map[end.x][end.y] = directionToChar(end.d);
    // print(map);

    let [x, y, d] = processInstruction({
      map,
      instr: 1,
      x: start.x,
      y: start.y,
      direction: dir,
      is3D: true,
    });

    expect(x).toBe(end.x);
    expect(y).toBe(end.y);
    expect(d).toBe(end.d); // down
  });
  it("should wrap in the TOP plane and keep moving", () => {
    start = { x: 189, y: 0 };
    end = { x: 9, y: 89, d: 1 };
    map[start.x][start.y] = directionToChar(dir);
    map[end.x][end.y] = directionToChar(end.d);
    // print(map);

    let [x, y, d] = processInstruction({
      map,
      instr: 10,
      x: start.x,
      y: start.y,
      direction: dir,
      is3D: true,
    });

    expect(x).toBe(end.x);
    expect(y).toBe(end.y);
    expect(d).toBe(end.d); // down
  });
  it("should wrap in the TOP plane and keep moving untill the wall", () => {
    start = { x: 189, y: 0 };
    end = { x: 10, y: 89, d: 1 };
    map[start.x][start.y] = directionToChar(dir);
    map[end.x + 1][end.y] = "#";
    // print(map);

    let [x, y, d] = processInstruction({
      map,
      instr: 50,
      x: start.x,
      y: start.y,
      direction: dir,
      is3D: true,
    });

    expect(x).toBe(end.x);
    expect(y).toBe(end.y);
    expect(d).toBe(end.d); // down
  });
  it("should not wrap in the TOP plane if next is wall", () => {
    start = { x: 189, y: 0 };
    end = { x: 0, y: 89, d: 1 };
    map[start.x][start.y] = directionToChar(dir);
    map[end.x][end.y] = "#";
    // print(map);

    let [x, y, d] = processInstruction({
      map,
      instr: 10,
      x: start.x,
      y: start.y,
      direction: dir,
      is3D: true,
    });

    expect(x).toBe(start.x);
    expect(y).toBe(start.y);
    expect(d).toBe(dir); // still left
  });
});

describe("Moving to the RIGHT from RIGHT plane", () => {
  let map;
  let dir = 0;
  let start;
  let end;
  beforeEach(() => {
    map = generateFakeMap();
    dir = 0;
  });
  afterEach(() => {
    expect(identifyPlane(map, start)).toBe("RIGHT");
    expect(identifyPlane(map, end)).toBe("BOTTOM");
  });
  // x=10, y=150 -> x=140, y=100 dir left
  it("should wrap in the BOTTOM plane", () => {
    start = { x: 10, y: 149 };
    end = { x: 139, y: 99, d: 2 };
    map[start.x][start.y] = directionToChar(dir);
    map[end.x][end.y] = directionToChar(end.d);
    // print(map);

    let [x, y, d] = processInstruction({
      map,
      instr: 1,
      x: start.x,
      y: start.y,
      direction: dir,
      is3D: true,
    });

    expect(x).toBe(end.x);
    expect(y).toBe(end.y);
    expect(d).toBe(end.d); // left
  });
  it("should wrap in the BOTTOM plane and keep moving", () => {
    start = { x: 10, y: 149 };
    end = { x: 139, y: 90, d: 2 };
    map[start.x][start.y] = directionToChar(dir);
    map[end.x][end.y] = directionToChar(end.d);
    // print(map);

    let [x, y, d] = processInstruction({
      map,
      instr: 10,
      x: start.x,
      y: start.y,
      direction: dir,
      is3D: true,
    });

    expect(x).toBe(end.x);
    expect(y).toBe(end.y);
    expect(d).toBe(end.d); // left
  });
  it("should wrap in the BOTTOM plane and keep moving untill the wall", () => {
    start = { x: 10, y: 149 };
    end = { x: 139, y: 90, d: 2 };
    map[start.x][start.y] = directionToChar(dir);
    map[end.x][end.y - 1] = "#";
    // print(map);

    let [x, y, d] = processInstruction({
      map,
      instr: 50,
      x: start.x,
      y: start.y,
      direction: dir,
      is3D: true,
    });

    expect(x).toBe(end.x);
    expect(y).toBe(end.y);
    expect(d).toBe(end.d); // left
  });
  it("should not wrap in the BOTTOM plane if next is wall", () => {
    start = { x: 10, y: 149 };
    end = { x: 139, y: 99, d: 2 };
    map[start.x][start.y] = directionToChar(dir);
    map[end.x][end.y] = "#";
    // print(map);

    let [x, y, d] = processInstruction({
      map,
      instr: 10,
      x: start.x,
      y: start.y,
      direction: dir,
      is3D: true,
    });

    expect(x).toBe(start.x);
    expect(y).toBe(start.y);
    expect(d).toBe(dir); // still right
  });
});

describe("Moving to the RIGHT from FRONT plane", () => {
  let map;
  let dir = 0;
  let start;
  let end;
  beforeEach(() => {
    map = generateFakeMap();
    dir = 0;
  });
  afterEach(() => {
    expect(identifyPlane(map, start)).toBe("FRONT");
    expect(identifyPlane(map, end)).toBe("RIGHT");
  });
  // x=90, y=100 -> x=50, y=140 dir up
  it("should wrap in the RIGHT plane", () => {
    start = { x: 90, y: 99 };
    end = { x: 49, y: 140, d: 3 };
    map[start.x][start.y] = directionToChar(dir);
    map[end.x][end.y] = directionToChar(end.d);
    // print(map);

    let [x, y, d] = processInstruction({
      map,
      instr: 1,
      x: start.x,
      y: start.y,
      direction: dir,
      is3D: true,
    });

    expect(x).toBe(end.x);
    expect(y).toBe(end.y);
    expect(d).toBe(end.d); // up
  });
  it("should wrap in the RIGHT plane and keep moving", () => {
    start = { x: 90, y: 99 };
    end = { x: 40, y: 140, d: 3 };
    map[start.x][start.y] = directionToChar(dir);
    map[end.x][end.y] = directionToChar(end.d);
    // print(map);

    let [x, y, d] = processInstruction({
      map,
      instr: 10,
      x: start.x,
      y: start.y,
      direction: dir,
      is3D: true,
    });

    expect(x).toBe(end.x);
    expect(y).toBe(end.y);
    expect(d).toBe(end.d); // up
  });
  it("should wrap in the RIGHT plane and keep moving untill the wall", () => {
    start = { x: 90, y: 99 };
    end = { x: 40, y: 140, d: 3 };
    map[start.x][start.y] = directionToChar(dir);
    map[end.x - 1][end.y] = "#";
    // print(map);

    let [x, y, d] = processInstruction({
      map,
      instr: 50,
      x: start.x,
      y: start.y,
      direction: dir,
      is3D: true,
    });

    expect(x).toBe(end.x);
    expect(y).toBe(end.y);
    expect(d).toBe(end.d); // up
  });
  it("should not wrap in the RIGHT plane if next is wall", () => {
    start = { x: 90, y: 99 };
    end = { x: 49, y: 140, d: 3 };
    map[start.x][start.y] = directionToChar(dir);
    map[end.x][end.y] = "#";
    // print(map);

    let [x, y, d] = processInstruction({
      map,
      instr: 10,
      x: start.x,
      y: start.y,
      direction: dir,
      is3D: true,
    });

    expect(x).toBe(start.x);
    expect(y).toBe(start.y);
    expect(d).toBe(dir); // still right
  });
});

describe("Moving to the RIGHT from BOTTOM plane", () => {
  let map;
  let dir = 0;
  let start;
  let end;
  beforeEach(() => {
    map = generateFakeMap();
    dir = 0;
  });
  afterEach(() => {
    expect(identifyPlane(map, start)).toBe("BOTTOM");
    expect(identifyPlane(map, end)).toBe("RIGHT");
  });
  // x=140, y=99 -> x=10, y=150 dir left
  it("should wrap in the RIGHT plane", () => {
    start = { x: 140, y: 99 };
    end = { x: 9, y: 149, d: 2 };
    map[start.x][start.y] = directionToChar(dir);
    map[end.x][end.y] = directionToChar(end.d);
    // print(map);

    let [x, y, d] = processInstruction({
      map,
      instr: 1,
      x: start.x,
      y: start.y,
      direction: dir,
      is3D: true,
    });

    expect(x).toBe(end.x);
    expect(y).toBe(end.y);
    expect(d).toBe(end.d); // left
  });
  it("should wrap in the RIGHT plane and keep moving", () => {
    start = { x: 140, y: 99 };
    end = { x: 9, y: 140, d: 2 };
    map[start.x][start.y] = directionToChar(dir);
    map[end.x][end.y] = directionToChar(end.d);
    // print(map);

    let [x, y, d] = processInstruction({
      map,
      instr: 10,
      x: start.x,
      y: start.y,
      direction: dir,
      is3D: true,
    });

    expect(x).toBe(end.x);
    expect(y).toBe(end.y);
    expect(d).toBe(end.d); // left
  });
  it("should wrap in the RIGHT plane and keep moving untill the wall", () => {
    start = { x: 140, y: 99 };
    end = { x: 9, y: 140, d: 2 };
    map[start.x][start.y] = directionToChar(dir);
    map[end.x][end.y - 1] = "#";
    // print(map);

    let [x, y, d] = processInstruction({
      map,
      instr: 50,
      x: start.x,
      y: start.y,
      direction: dir,
      is3D: true,
    });

    expect(x).toBe(end.x);
    expect(y).toBe(end.y);
    expect(d).toBe(end.d); // left
  });
  it("should not wrap in the RIGHT plane if next is wall", () => {
    start = { x: 140, y: 99 };
    end = { x: 9, y: 149, d: 2 };
    map[start.x][start.y] = directionToChar(dir);
    map[end.x][end.y] = "#";
    // print(map);

    let [x, y, d] = processInstruction({
      map,
      instr: 10,
      x: start.x,
      y: start.y,
      direction: dir,
      is3D: true,
    });

    expect(x).toBe(start.x);
    expect(y).toBe(start.y);
    expect(d).toBe(dir); // still right
  });
});

describe("Moving UP from LEFT plane", () => {
  let map;
  let dir;
  let start;
  let end;
  beforeEach(() => {
    map = generateFakeMap();
    dir = 3; // up
  });
  afterEach(() => {
    expect(identifyPlane(map, start)).toBe("LEFT");
    expect(identifyPlane(map, end)).toBe("FRONT");
  });
  // x=99 y=40 -> x=60 y=50 dir right
  it("should wrap in the FRONT plane", () => {
    start = { x: 100, y: 40 };
    end = { x: 90, y: 50, d: 0 };
    map[start.x][start.y] = directionToChar(dir);
    map[end.x][end.y] = directionToChar(end.d);
    // print(map);

    let [x, y, d] = processInstruction({
      map,
      instr: 1,
      x: start.x,
      y: start.y,
      direction: dir,
      is3D: true,
    });

    expect(x).toBe(end.x);
    expect(y).toBe(end.y);
    expect(d).toBe(end.d); // right
  });
  it("should wrap in the FRONT plane and keep moving", () => {
    start = { x: 100, y: 40 };
    end = { x: 90, y: 59, d: 0 };
    map[start.x][start.y] = directionToChar(dir);
    map[end.x][end.y] = directionToChar(end.d);
    // print(map);

    let [x, y, d] = processInstruction({
      map,
      instr: 10,
      x: start.x,
      y: start.y,
      direction: dir,
      is3D: true,
    });

    expect(x).toBe(end.x);
    expect(y).toBe(end.y);
    expect(d).toBe(end.d); // right
  });
  it("should wrap in the FRONT plane and keep moving untill the wall", () => {
    start = { x: 100, y: 40 };
    end = { x: 90, y: 59, d: 0 };
    map[start.x][start.y] = directionToChar(dir);
    map[end.x][end.y + 1] = "#";
    // print(map);

    let [x, y, d] = processInstruction({
      map,
      instr: 50,
      x: start.x,
      y: start.y,
      direction: dir,
      is3D: true,
    });

    expect(x).toBe(end.x);
    expect(y).toBe(end.y);
    expect(d).toBe(end.d); // right
  });
  it("should not wrap in the FRONT plane if next is wall", () => {
    start = { x: 100, y: 40 };
    end = { x: 90, y: 50, d: 0 };
    map[start.x][start.y] = directionToChar(dir);
    map[end.x][end.y] = "#";
    // print(map);

    let [x, y, d] = processInstruction({
      map,
      instr: 10,
      x: start.x,
      y: start.y,
      direction: dir,
      is3D: true,
    });

    expect(x).toBe(start.x);
    expect(y).toBe(start.y);
    expect(d).toBe(dir); // still up
  });
});

describe("Moving UP from TOP plane", () => {
  let map;
  let dir;
  let start;
  let end;
  beforeEach(() => {
    map = generateFakeMap();
    dir = 3; // up
  });
  afterEach(() => {
    expect(identifyPlane(map, start)).toBe("TOP");
    expect(identifyPlane(map, end)).toBe("BACK");
  });
  // x=0, y=90 -> x=190, y=0 dir right
  it("should wrap in the BACK plane", () => {
    start = { x: 0, y: 90 };
    end = { x: 190, y: 0, d: 0 };
    map[start.x][start.y] = directionToChar(dir);
    map[end.x][end.y] = directionToChar(end.d);
    // print(map);

    let [x, y, d] = processInstruction({
      map,
      instr: 1,
      x: start.x,
      y: start.y,
      direction: dir,
      is3D: true,
    });

    expect(x).toBe(end.x);
    expect(y).toBe(end.y);
    expect(d).toBe(end.d); // right
  });
  it("should wrap in the BACK plane and keep moving", () => {
    start = { x: 0, y: 90 };
    end = { x: 190, y: 9, d: 0 };
    map[start.x][start.y] = directionToChar(dir);
    map[end.x][end.y] = directionToChar(end.d);
    // print(map);

    let [x, y, d] = processInstruction({
      map,
      instr: 10,
      x: start.x,
      y: start.y,
      direction: dir,
      is3D: true,
    });

    expect(x).toBe(end.x);
    expect(y).toBe(end.y);
    expect(d).toBe(end.d); // right
  });
  it("should wrap in the BACK plane and keep moving untill the wall", () => {
    start = { x: 0, y: 90 };
    end = { x: 190, y: 9, d: 0 };
    map[start.x][start.y] = directionToChar(dir);
    map[end.x][end.y + 1] = "#";
    // print(map);

    let [x, y, d] = processInstruction({
      map,
      instr: 50,
      x: start.x,
      y: start.y,
      direction: dir,
      is3D: true,
    });

    expect(x).toBe(end.x);
    expect(y).toBe(end.y);
    expect(d).toBe(end.d); // right
  });
  it("should not wrap in the BACK plane if next is wall", () => {
    start = { x: 0, y: 90 };
    end = { x: 190, y: 0, d: 0 };
    map[start.x][start.y] = directionToChar(dir);
    map[end.x][end.y] = "#";
    // print(map);

    let [x, y, d] = processInstruction({
      map,
      instr: 10,
      x: start.x,
      y: start.y,
      direction: dir,
      is3D: true,
    });

    expect(x).toBe(start.x);
    expect(y).toBe(start.y);
    expect(d).toBe(dir); // still up
  });
});

describe("Moving UP from RIGHT plane", () => {
  let map;
  let dir;
  let start;
  let end;
  beforeEach(() => {
    map = generateFakeMap();
    dir = 3; // up
  });
  afterEach(() => {
    expect(identifyPlane(map, start)).toBe("RIGHT");
    expect(identifyPlane(map, end)).toBe("BACK");
  });
  // x=0, y=140 -> x=199, y=40 dir up
  it("should wrap in the BACK plane", () => {
    start = { x: 0, y: 140 };
    end = { x: 199, y: 40, d: 3 };
    map[start.x][start.y] = directionToChar(dir);
    map[end.x][end.y] = directionToChar(end.d);
    // print(map);

    let [x, y, d] = processInstruction({
      map,
      instr: 1,
      x: start.x,
      y: start.y,
      direction: dir,
      is3D: true,
    });

    expect(x).toBe(end.x);
    expect(y).toBe(end.y);
    expect(d).toBe(end.d); // right
  });
  it("should wrap in the BACK plane and keep moving", () => {
    start = { x: 0, y: 140 };
    end = { x: 190, y: 40, d: 3 };
    map[start.x][start.y] = directionToChar(dir);
    map[end.x][end.y] = directionToChar(end.d);
    // print(map);

    let [x, y, d] = processInstruction({
      map,
      instr: 10,
      x: start.x,
      y: start.y,
      direction: dir,
      is3D: true,
    });

    expect(x).toBe(end.x);
    expect(y).toBe(end.y);
    expect(d).toBe(end.d); // right
  });
  it("should wrap in the BACK plane and keep moving untill the wall", () => {
    start = { x: 0, y: 140 };
    end = { x: 190, y: 40, d: 3 };
    map[start.x][start.y] = directionToChar(dir);
    map[end.x - 1][end.y] = "#";
    // print(map);

    let [x, y, d] = processInstruction({
      map,
      instr: 50,
      x: start.x,
      y: start.y,
      direction: dir,
      is3D: true,
    });

    expect(x).toBe(end.x);
    expect(y).toBe(end.y);
    expect(d).toBe(end.d); // right
  });
  it("should not wrap in the BACK plane if next is wall", () => {
    start = { x: 0, y: 140 };
    end = { x: 199, y: 40, d: 3 };
    map[start.x][start.y] = directionToChar(dir);
    map[end.x][end.y] = "#";
    // print(map);

    let [x, y, d] = processInstruction({
      map,
      instr: 10,
      x: start.x,
      y: start.y,
      direction: dir,
      is3D: true,
    });

    expect(x).toBe(start.x);
    expect(y).toBe(start.y);
    expect(d).toBe(dir); // still up
  });
});

describe("Moving DOWN from BACK plane", () => {
  let map;
  let dir;
  let start;
  let end;
  beforeEach(() => {
    map = generateFakeMap();
    dir = 1; // down
  });
  afterEach(() => {
    expect(identifyPlane(map, start)).toBe("BACK");
    expect(identifyPlane(map, end)).toBe("RIGHT");
  });
  // x=199, y=40 -> x=0, y=140 dir down

  it("should wrap in the RIGHT plane", () => {
    start = { x: 199, y: 40 };
    end = { x: 0, y: 140, d: 1 };
    map[start.x][start.y] = directionToChar(dir);
    map[end.x][end.y] = directionToChar(end.d);
    // print(map);

    let [x, y, d] = processInstruction({
      map,
      instr: 1,
      x: start.x,
      y: start.y,
      direction: dir,
      is3D: true,
    });

    expect(x).toBe(end.x);
    expect(y).toBe(end.y);
    expect(d).toBe(end.d); // right
  });
  it("should wrap in the RIGHT plane and keep moving", () => {
    start = { x: 199, y: 40 };
    end = { x: 9, y: 140, d: 1 };
    map[start.x][start.y] = directionToChar(dir);
    map[end.x][end.y] = directionToChar(end.d);
    // print(map);

    let [x, y, d] = processInstruction({
      map,
      instr: 10,
      x: start.x,
      y: start.y,
      direction: dir,
      is3D: true,
    });

    expect(x).toBe(end.x);
    expect(y).toBe(end.y);
    expect(d).toBe(end.d); // right
  });
  it("should wrap in the RIGHT plane and keep moving untill the wall", () => {
    start = { x: 199, y: 40 };
    end = { x: 9, y: 140, d: 1 };
    map[start.x][start.y] = directionToChar(dir);
    map[end.x + 1][end.y] = "#";
    // print(map);

    let [x, y, d] = processInstruction({
      map,
      instr: 50,
      x: start.x,
      y: start.y,
      direction: dir,
      is3D: true,
    });

    expect(x).toBe(end.x);
    expect(y).toBe(end.y);
    expect(d).toBe(end.d); // right
  });
  it("should not wrap in the RIGHT plane if next is wall", () => {
    start = { x: 199, y: 40 };
    end = { x: 0, y: 140, d: 1 };
    map[start.x][start.y] = directionToChar(dir);
    map[end.x][end.y] = "#";
    // print(map);

    let [x, y, d] = processInstruction({
      map,
      instr: 10,
      x: start.x,
      y: start.y,
      direction: dir,
      is3D: true,
    });

    expect(x).toBe(start.x);
    expect(y).toBe(start.y);
    expect(d).toBe(dir); // still up
  });
});
describe("Moving DOWN from BOTTOM plane", () => {
  let map;
  let dir;
  let start;
  let end;
  beforeEach(() => {
    map = generateFakeMap();
    dir = 1; // down
  });
  afterEach(() => {
    expect(identifyPlane(map, start)).toBe("BOTTOM");
    expect(identifyPlane(map, end)).toBe("BACK");
  });
  // x=149, y=60 -> x=160, y=49 dir left

  it("should wrap in the BACK plane", () => {
    start = { x: 149, y: 60 };
    end = { x: 160, y: 49, d: 2 };
    map[start.x][start.y] = directionToChar(dir);
    map[end.x][end.y] = directionToChar(end.d);
    // print(map);

    let [x, y, d] = processInstruction({
      map,
      instr: 1,
      x: start.x,
      y: start.y,
      direction: dir,
      is3D: true,
    });

    expect(x).toBe(end.x);
    expect(y).toBe(end.y);
    expect(d).toBe(end.d); // right
  });
});

describe("REAL MAP TEST CASES", () => {
  let map;
  let dir;
  let start;
  let end;
  beforeEach(() => {
    map = generateFakeMap();
  });
  it("LEFT TO TOP x=104, y=0 dir=2-> newX=45, newY=50 newDir=0", () => {
    dir = 2; // left
    start = { x: 104, y: 0 };
    end = { x: 45, y: 50, d: 0 };
    map[start.x][start.y] = directionToChar(dir);
    map[end.x][end.y] = directionToChar(end.d);
    // print(map);

    let [x, y, d] = processInstruction({
      map,
      instr: 1,
      x: start.x,
      y: start.y,
      direction: dir,
      is3D: true,
    });
    expect(identifyPlane(map, start)).toBe("LEFT");
    expect(identifyPlane(map, end)).toBe("TOP");
    expect(x).toBe(end.x);
    expect(y).toBe(end.y);
    expect(d).toBe(end.d); // right
  });
  //LEFT TO FRONT x=100, y=47 dir=3-> newX=53, newY=50 newDir=0
  it("LEFT TO FRONT x=100, y=47 dir=3-> newX=53, newY=50 newDir=0", () => {
    dir = 3; // up
    start = { x: 100, y: 47 };
    end = { x: 97, y: 50, d: 0 };
    map[start.x][start.y] = directionToChar(dir);
    map[end.x][end.y] = directionToChar(end.d);
    // print(map);

    let [x, y, d] = processInstruction({
      map,
      instr: 1,
      x: start.x,
      y: start.y,
      direction: dir,
      is3D: true,
    });
    expect(identifyPlane(map, start)).toBe("LEFT");
    expect(identifyPlane(map, end)).toBe("FRONT");
    expect(x).toBe(end.x);
    expect(y).toBe(end.y);
    expect(d).toBe(end.d); // right
  });
  // LEFT TO BOTTOM x=100, y=1 dir=3-> newX=51, newY=50 newDir=0
  it("LEFT TO FRONT x=100, y=1 dir=3-> newX=51, newY=50 newDir=0", () => {
    dir = 3; // up
    start = { x: 100, y: 1 };
    end = { x: 51, y: 50, d: 0 };
    map[start.x][start.y] = directionToChar(dir);
    map[end.x][end.y] = directionToChar(end.d);
    // print(map);

    let [x, y, d] = processInstruction({
      map,
      instr: 1,
      x: start.x,
      y: start.y,
      direction: dir,
      is3D: true,
    });
    expect(x).toBe(end.x);
    expect(y).toBe(end.y);
    expect(d).toBe(end.d); // right
    expect(identifyPlane(map, start)).toBe("LEFT");
    expect(identifyPlane(map, end)).toBe("FRONT");
  });
  // RIGHT TO FRONT x=49, y=102 dir=1-> newX=52, newY=99 newDir=2
  it("RIGHT TO FRONT x=49, y=102 dir=1-> newX=52, newY=99 newDir=2", () => {
    dir = 1; // down
    start = { x: 49, y: 102 };
    end = { x: 52, y: 99, d: 2 };
    map[start.x][start.y] = directionToChar(dir);
    map[end.x][end.y] = directionToChar(end.d);
    // print(map);

    let [x, y, d] = processInstruction({
      map,
      instr: 1,
      x: start.x,
      y: start.y,
      direction: dir,
      is3D: true,
    });
    expect(identifyPlane(map, start)).toBe("RIGHT");
    expect(identifyPlane(map, end)).toBe("FRONT");
    expect(x).toBe(end.x);
    expect(y).toBe(end.y);
    expect(d).toBe(end.d); // right
  });

  // RIGHT TO BOTTOM x=0, y=149 dir=0-> newX=149, newY=99 newDir=2
  it("RIGHT TO BOTTOM x=0, y=149 dir=0-> newX=149, newY=99 newDir=2", () => {
    dir = 0; // down
    start = { x: 1, y: 149 };
    end = { x: 148, y: 99, d: 2 };
    map[start.x][start.y] = directionToChar(dir);
    map[end.x][end.y] = directionToChar(end.d);
    // print(map);

    let [x, y, d] = processInstruction({
      map,
      instr: 1,
      x: start.x,
      y: start.y,
      direction: dir,
      is3D: true,
    });
    expect(identifyPlane(map, start)).toBe("RIGHT");
    expect(identifyPlane(map, end)).toBe("BOTTOM");
    expect(x).toBe(end.x);
    expect(y).toBe(end.y);
    expect(d).toBe(end.d); // right
  });

  // RIGHT TO BACK x=0, y=149 dir=3-> newX=199, newY=22 newDir=3
  it("RIGHT TO BACK x=0, y=149 dir=3-> newX=199, newY=22 newDir=3", () => {
    dir = 3; // left
    start = { x: 0, y: 148 };
    end = { x: 199, y: 48, d: 3 };
    map[start.x][start.y] = directionToChar(dir);
    map[end.x][end.y] = directionToChar(end.d);
    // print(map);

    let [x, y, d] = processInstruction({
      map,
      instr: 1,
      x: start.x,
      y: start.y,
      direction: dir,
      is3D: true,
    });
    expect(identifyPlane(map, start)).toBe("RIGHT");
    expect(identifyPlane(map, end)).toBe("BACK");
    expect(x).toBe(end.x);
    expect(y).toBe(end.y);
    expect(d).toBe(end.d); // right
  });

  // BACK TO BOTTOM x=153, y=49 dir=0-> newX=149, newY=53 newDir=3
  it("BACK TO BOTTOM x=153, y=49 dir=0-> newX=149, newY=53 newDir=3", () => {
    dir = 0; // down
    start = { x: 153, y: 49 };
    end = { x: 149, y: 53, d: 3 };
    map[start.x][start.y] = directionToChar(dir);
    map[end.x][end.y] = directionToChar(end.d);
    // print(map);

    let [x, y, d] = processInstruction({
      map,
      instr: 1,
      x: start.x,
      y: start.y,
      direction: dir,
      is3D: true,
    });
    expect(identifyPlane(map, start)).toBe("BACK");
    expect(identifyPlane(map, end)).toBe("BOTTOM");
    expect(x).toBe(end.x);
    expect(y).toBe(end.y);
    expect(d).toBe(end.d); // right
  });

  // BACK TO RIGHT x=199, y=49 dir=1-> newX=0, newY=149 newDir=1
  it("BACK TO RIGHT x=199, y=49 dir=1-> newX=0, newY=149 newDir=1", () => {
    dir = 1; // down
    start = { x: 199, y: 48 };
    end = { x: 0, y: 148, d: 1 };
    map[start.x][start.y] = directionToChar(dir);
    map[end.x][end.y] = directionToChar(end.d);
    // print(map);

    let [x, y, d] = processInstruction({
      map,
      instr: 1,
      x: start.x,
      y: start.y,
      direction: dir,
      is3D: true,
    });
    expect(identifyPlane(map, start)).toBe("BACK");
    expect(identifyPlane(map, end)).toBe("RIGHT");
    expect(x).toBe(end.x);
    expect(y).toBe(end.y);
    expect(d).toBe(end.d); // right
  });
  // BACK TO TOP x=150, y=0 dir=2-> newX=0, newY=50 newDir=1
  it("BACK TO TOP x=150, y=0 dir=2-> newX=0, newY=50 newDir=1", () => {
    dir = 2; // up
    start = { x: 151, y: 0 };
    end = { x: 0, y: 51, d: 1 };
    map[start.x][start.y] = directionToChar(dir);
    map[end.x][end.y] = directionToChar(end.d);
    // print(map);

    let [x, y, d] = processInstruction({
      map,
      instr: 1,
      x: start.x,
      y: start.y,
      direction: dir,
      is3D: true,
    });
    expect(identifyPlane(map, start)).toBe("BACK");
    expect(identifyPlane(map, end)).toBe("TOP");
    expect(x).toBe(end.x);
    expect(y).toBe(end.y);
    expect(d).toBe(end.d); // right
  });
  // BACK TO TOP x=176, y=0 dir=2-> newX=0, newY=76 newDir=1
  it("BACK TO TOP x=176, y=0 dir=2-> newX=0, newY=76 newDir=1", () => {
    dir = 2; //left
    start = { x: 176, y: 0 };
    end = { x: 0, y: 76, d: 1 };
    map[start.x][start.y] = directionToChar(dir);
    map[end.x][end.y] = directionToChar(end.d);
    // print(map);

    let [x, y, d] = processInstruction({
      map,
      instr: 1,
      x: start.x,
      y: start.y,
      direction: dir,
      is3D: true,
    });
    expect(identifyPlane(map, start)).toBe("BACK");
    expect(identifyPlane(map, end)).toBe("TOP");
    expect(x).toBe(end.x);
    expect(y).toBe(end.y);
    expect(d).toBe(end.d); // right
  });

  // TOP TO LEFT x=3, y=50 dir=2-> newX=146, newY=0 newDir=0
  it("TOP TO LEFT x=3, y=50 dir=2-> newX=146, newY=0 newDir=0", () => {
    dir = 2; //left
    start = { x: 3, y: 50 };
    end = { x: 146, y: 0, d: 0 };
    map[start.x][start.y] = directionToChar(dir);
    map[end.x][end.y] = directionToChar(end.d);
    // print(map);

    let [x, y, d] = processInstruction({
      map,
      instr: 1,
      x: start.x,
      y: start.y,
      direction: dir,
      is3D: true,
    });
    expect(identifyPlane(map, start)).toBe("TOP");
    expect(identifyPlane(map, end)).toBe("LEFT");
    expect(x).toBe(end.x);
    expect(y).toBe(end.y);
    expect(d).toBe(end.d); // right
  });

  // TOP TO BACK x=0, y=50 dir=3-> newX=150, newY=0 newDir=0
  it("TOP TO BACK x=0, y=50 dir=3-> newX=150, newY=0 newDir=0", () => {
    dir = 3; // up
    start = { x: 0, y: 51 };
    end = { x: 151, y: 0, d: 0 };
    map[start.x][start.y] = directionToChar(dir);
    map[end.x][end.y] = directionToChar(end.d);
    // print(map);

    let [x, y, d] = processInstruction({
      map,
      instr: 1,
      x: start.x,
      y: start.y,
      direction: dir,
      is3D: true,
    });
    expect(identifyPlane(map, start)).toBe("TOP");
    expect(identifyPlane(map, end)).toBe("BACK");
    expect(x).toBe(end.x);
    expect(y).toBe(end.y);
    expect(d).toBe(end.d); // right
  });

  // TOP TO BACK x=0, y=99 dir=3-> newX=199, newY=0 newDir=0
  it("TOP TO BACK x=0, y=99 dir=3-> newX=199, newY=0 newDir=0", () => {
    dir = 3; //left
    start = { x: 0, y: 99 };
    end = { x: 199, y: 0, d: 0 };
    map[start.x][start.y] = directionToChar(dir);
    map[end.x][end.y] = directionToChar(end.d);
    // print(map);

    let [x, y, d] = processInstruction({
      map,
      instr: 1,
      x: start.x,
      y: start.y,
      direction: dir,
      is3D: true,
    });
    expect(identifyPlane(map, start)).toBe("TOP");
    expect(identifyPlane(map, end)).toBe("BACK");
    expect(x).toBe(end.x);
    expect(y).toBe(end.y);
    expect(d).toBe(end.d); // right
  });

  // FRONT TO RIGHT x=98, y=99 dir=0-> newX=49, newY=148 newDir=3
  it("FRONT TO RIGHT x=98, y=99 dir=0-> newX=49, newY=148 newDir=3", () => {
    dir = 0; //right
    start = { x: 98, y: 99 };
    end = { x: 49, y: 148, d: 3 };
    map[start.x][start.y] = directionToChar(dir);
    map[end.x][end.y] = directionToChar(end.d);
    print(map);

    let [x, y, d] = processInstruction({
      map,
      instr: 1,
      x: start.x,
      y: start.y,
      direction: dir,
      is3D: true,
    });
    expect(identifyPlane(map, start)).toBe("FRONT");
    expect(identifyPlane(map, end)).toBe("RIGHT");
    expect(x).toBe(end.x);
    expect(y).toBe(end.y);
    expect(d).toBe(end.d); // up
  });

  // FRONT TO LEFT x=98, y=50 dir=2-> newX=100, newY=48 newDir=1
  it("FRONT TO LEFT x=98, y=50 dir=2-> newX=100, newY=48 newDir=1", () => {
    dir = 2; //left
    start = { x: 98, y: 50 };
    end = { x: 100, y: 48, d: 1 };
    map[start.x][start.y] = directionToChar(dir);
    map[end.x][end.y] = directionToChar(end.d);
    // print(map);

    let [x, y, d] = processInstruction({
      map,
      instr: 1,
      x: start.x,
      y: start.y,
      direction: dir,
      is3D: true,
    });
    expect(identifyPlane(map, start)).toBe("FRONT");
    expect(identifyPlane(map, end)).toBe("LEFT");
    expect(x).toBe(end.x);
    expect(y).toBe(end.y);
    expect(d).toBe(end.d); // right
  });

  //BOTTOM TO RIGHT x=134, y=99 dir=0-> newX=16, newY=149 newDir=2
  it("BOTTOM TO RIGHT x=134, y=99 dir=0-> newX=16, newY=149 newDir=2", () => {
    dir = 0; //right
    start = { x: 149, y: 99 };
    end = { x: 0, y: 149, d: 2 };
    map[start.x][start.y] = directionToChar(dir);
    map[end.x][end.y] = directionToChar(end.d);
    // print(map);

    let [x, y, d] = processInstruction({
      map,
      instr: 1,
      x: start.x,
      y: start.y,
      direction: dir,
      is3D: true,
    });
    expect(identifyPlane(map, start)).toBe("BOTTOM");
    expect(identifyPlane(map, end)).toBe("RIGHT");
    expect(x).toBe(end.x);
    expect(y).toBe(end.y);
    expect(d).toBe(end.d); // up
  });
  // BOTTOM TO BACK x=149, y=69 dir=1-> newX=169, newY=49 newDir=2
  it("BOTTOM TO BACK x=149, y=69 dir=1-> newX=169, newY=49 newDir=2", () => {
    dir = 1; //right
    start = { x: 149, y: 69 };
    end = { x: 169, y: 49, d: 2 };
    map[start.x][start.y] = directionToChar(dir);
    map[end.x][end.y] = directionToChar(end.d);
    // print(map);

    let [x, y, d] = processInstruction({
      map,
      instr: 1,
      x: start.x,
      y: start.y,
      direction: dir,
      is3D: true,
    });
    expect(identifyPlane(map, start)).toBe("BOTTOM");
    expect(identifyPlane(map, end)).toBe("BACK");
    expect(x).toBe(end.x);
    expect(y).toBe(end.y);
    expect(d).toBe(end.d); // up
  });
});
