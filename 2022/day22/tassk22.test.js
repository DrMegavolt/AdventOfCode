import { jest } from "@jest/globals";
import { processInstruction } from "./instructionProcessor.js";

describe("Change direction on command", () => {
  let direction = 0;
  let x = 0;
  let y = 0;
  let map = [[]];
  let [newX, newY, newD] = [-1, -1, -1];
  beforeEach(() => {
    direction = 0;
    x = 0;
    y = 0;
    map = [
      [".", ".", ".", "#", ".", ".", ".", ".", ".", "."],
      [".", ".", ".", ".", ".", ".", ".", ".", ".", "."],
      [".", ".", ".", ".", ".", ".", ".", ".", ".", "."],
      [".", ".", "#", ".", ".", ".", ".", ".", ".", "."],
    ];
  });
  afterEach(() => {
    expect(newX).toBe(0);
    expect(newY).toBe(0);
    expect(map[newX][newY]).toBe(".");
  });

  it("should turn from > to ^ on R", () => {
    direction = 0;
    [newX, newY, newD] = processInstruction({
      map,
      instr: "R",
      x,
      y,
      direction,
    });
    expect(newD).toBe(1);
  });
  it("should turn from ^ to < on R", () => {
    direction = 1;
    [newX, newY, newD] = processInstruction({
      map,
      instr: "R",
      x,
      y,
      direction,
    });
    expect(newD).toBe(2);
  });

  it("should turn from < to v on R", () => {
    direction = 2;
    [newX, newY, newD] = processInstruction({
      map,
      instr: "R",
      x,
      y,
      direction,
    });
    expect(newD).toBe(3);
  });
  it("should turn from v to > on R", () => {
    direction = 3;
    [newX, newY, newD] = processInstruction({
      map,
      instr: "R",
      x,
      y,
      direction,
    });
    expect(newD).toBe(0);
  });

  it("should turn from ^ to > on L", () => {
    direction = 1;
    [newX, newY, newD] = processInstruction({
      map,
      instr: "L",
      x,
      y,
      direction,
    });
    expect(newD).toBe(0);
  });
  it("should turn from < to ^ on L", () => {
    direction = 2;
    [newX, newY, newD] = processInstruction({
      map,
      instr: "L",
      x,
      y,
      direction,
    });
    expect(newD).toBe(1);
  });

  it("should turn from v to < on L", () => {
    direction = 3;
    [newX, newY, newD] = processInstruction({
      map,
      instr: "L",
      x,
      y,
      direction,
    });
    expect(newD).toBe(2);
  });
  it("should turn from > to v on L", () => {
    direction = 0;
    [newX, newY, newD] = processInstruction({
      map,
      instr: "L",
      x,
      y,
      direction,
    });
    expect(newD).toBe(3);
  });
});

describe("Horizontal Move", () => {
  let [newX, newY, newD] = [-1, -1, -1];
  let [x, y, direction] = [-1, -1, -1];
  let map = [[]];
  beforeEach(() => {
    x = 0;
    y = 0;
    map = [
      [".", ".", ".", "#", "."],
      [".", ".", ".", ".", ".", ".", ".", ".", ".", ".", undefined, undefined],
      ["#", ".", ".", ".", ".", ".", ".", ".", ".", "."],
      [".", ".", "#", ".", ".", ".", ".", ".", ".", "."],
      [".", ".", ".", ".", "#"],
    ];
  });
  afterEach(() => {
    expect(map[newX][newY]).toBe(".");
  });

  // move right tests
  it("should move 2 steps to the right of Command 2", () => {
    direction = 0;
    [newX, newY, newD] = processInstruction({ map, instr: 2, x, y, direction });
    expect(newD).toBe(0);
    expect(newX).toBe(0);
    expect(newY).toBe(2);
  });
  it("should wrap through undefined", () => {
    x = 1;
    y = 1;
    direction = 0;
    [newX, newY, newD] = processInstruction({
      map,
      instr: 20,
      x,
      y,
      direction,
    });
    expect(newD).toBe(0);
    expect(newX).toBe(1);
    expect(newY).toBe(1);
  });
  it("should move 2 steps to the right of Command 300 because wall", () => {
    direction = 0;
    [newX, newY, newD] = processInstruction({
      map,
      instr: 300,
      x,
      y,
      direction,
    });
    expect(newD).toBe(0);
    expect(newX).toBe(0);
    expect(newY).toBe(2);
  });
  it("should move 2 steps to the right of Command 4 because hit the wall", () => {
    direction = 0;
    [newX, newY, newD] = processInstruction({ map, instr: 4, x, y, direction });
    expect(newD).toBe(0);
    expect(newX).toBe(0);
    expect(newY).toBe(2);
  });
  it("should move 3 steps to the right of Command 4 because hit the wall", () => {
    direction = 0;
    [newX, newY, newD] = processInstruction({ map, instr: 4, x, y, direction });
    expect(newD).toBe(0);
    expect(newX).toBe(0);
    expect(newY).toBe(2);
  });
  it("should move 3 steps wrapping the map", () => {
    direction = 0;
    y = 4;

    [newX, newY, newD] = processInstruction({ map, instr: 3, x, y, direction });
    expect(newD).toBe(0);
    expect(newX).toBe(0);
    expect(newY).toBe(2);
  });
  it("should move 3 steps wrapping the map hitting the wall", () => {
    direction = 0;
    y = 4;

    [newX, newY, newD] = processInstruction({
      map,
      instr: 30,
      x,
      y,
      direction,
    });
    expect(newD).toBe(0);
    expect(newX).toBe(0);
    expect(newY).toBe(2);
  });
  it("should not move if wrapping the map hits the wall", () => {
    direction = 0;
    y = 9;
    x = 2;

    [newX, newY, newD] = processInstruction({
      map,
      instr: 30,
      x,
      y,
      direction,
    });
    expect(newD).toBe(0);
    expect(newX).toBe(2);
    expect(newY).toBe(y);
  });
  it("should move right untill the end and stop if wrap hots the wall", () => {
    direction = 0;
    y = 4;
    x = 2;

    [newX, newY, newD] = processInstruction({
      map,
      instr: 30,
      x,
      y,
      direction,
    });
    expect(newD).toBe(0);
    expect(newX).toBe(2);
    expect(newY).toBe(9);
  });

  // move left tests
  it("should move 2 steps to the left of Command 2", () => {
    direction = 2;
    x = 0;
    y = 2;

    [newX, newY, newD] = processInstruction({ map, instr: 2, x, y, direction });
    expect(newD).toBe(2);
    expect(newX).toBe(0);
    expect(newY).toBe(0);
  });
  it("should move 3 steps to the left of Command 3 and wrap", () => {
    direction = 2;
    x = 0;
    y = 2;

    [newX, newY, newD] = processInstruction({ map, instr: 3, x, y, direction });
    expect(newD).toBe(2);
    expect(newX).toBe(0);
    expect(newY).toBe(4);
  });
  it("should move 3 steps to the left of Command 30 and wrap and stop on the wall", () => {
    direction = 2;
    x = 0;
    y = 2;

    [newX, newY, newD] = processInstruction({
      map,
      instr: 30,
      x,
      y,
      direction,
    });
    expect(newD).toBe(2);
    expect(newX).toBe(0);
    expect(newY).toBe(4);
  });
  it("should move 2 steps to the left of Command 3 and stop because wrap is the wall", () => {
    direction = 2;
    x = 4;
    y = 2;

    [newX, newY, newD] = processInstruction({ map, instr: 3, x, y, direction });
    expect(newD).toBe(2);
    expect(newX).toBe(x);
    expect(newY).toBe(0);
  });
});
describe("Vertical Move", () => {
  let [newX, newY, newD] = [-1, -1, -1];
  let [x, y, direction] = [-1, -1, -1];
  let map = [[]];
  beforeEach(() => {
    x = 0;
    y = 0;
    map = [
      [".", ".", ".", "#", "."],
      [".", ".", ".", ".", ".", ".", ".", ".", ".", "."],
      ["#", ".", ".", ".", ".", ".", ".", ".", ".", "."],
      [".", ".", "#", ".", ".", ".", ".", ".", ".", "."],
      [".", ".", ".", ".", "#"],
    ];
  });
  afterEach(() => {
    expect(map[newX][newY]).toBe(".");
  });
  // move up tests
  it("should move 2 steps to the up of Command 2", () => {
    direction = 3;
    x = 2;
    y = 2;

    [newX, newY, newD] = processInstruction({ map, instr: 2, x, y, direction });
    expect(newD).toBe(3);
    expect(newX).toBe(0);
    expect(newY).toBe(2);
  });
  it("should move 3 steps to the up of Command 3 and wrap", () => {
    direction = 3;
    x = 2;
    y = 2;

    [newX, newY, newD] = processInstruction({ map, instr: 3, x, y, direction });
    expect(newD).toBe(3);
    expect(newX).toBe(4);
    expect(newY).toBe(2);
  });
  it("should move 3 steps to the up of Command 30 and wrap and hit the wall", () => {
    direction = 3;
    x = 2;
    y = 2;

    [newX, newY, newD] = processInstruction({
      map,
      instr: 30,
      x,
      y,
      direction,
    });
    expect(newD).toBe(3);
    expect(newX).toBe(4);
    expect(newY).toBe(2);
  });
  it("should move 3 steps to the up of Command 30 and not wrap because the wall", () => {
    direction = 3;
    x = 4;
    y = 4;

    [newX, newY, newD] = processInstruction({
      map,
      instr: 30,
      x,
      y,
      direction,
    });

    expect(newD).toBe(3);
    expect(newX).toBe(0);
    expect(newY).toBe(4);
  });

  // move down tests
  it("should move 2 steps to the down of Command 2", () => {
    direction = 1;
    x = 2;
    y = 1;
    [newX, newY, newD] = processInstruction({ map, instr: 2, x, y, direction });
    expect(newD).toBe(1);
    expect(newX).toBe(4);
    expect(newY).toBe(y);
  });
  it("should not move, hits the wall", () => {
    direction = 1;
    x = 2;
    y = 2;
    [newX, newY, newD] = processInstruction({ map, instr: 2, x, y, direction });
    expect(newD).toBe(1);
    expect(newX).toBe(2);
    expect(newX).toBe(y);
  });
  it("should move 2 steps to the down and not wrap because wall ", () => {
    direction = 1;
    x = 2;
    y = 3;
    [newX, newY, newD] = processInstruction({
      map,
      instr: 20,
      x,
      y,
      direction,
    });
    expect(newD).toBe(1);
    expect(newX).toBe(4);
    expect(newY).toBe(y);
  });
  it("should move 201 steps to the down and wrap ", () => {
    direction = 1;
    x = 2;
    y = 1;
    [newX, newY, newD] = processInstruction({
      map,
      instr: 201,
      x,
      y,
      direction,
    });
    expect(newD).toBe(1);
    expect(newX).toBe(3); // 5 rows, so 200 should wrap to 2 and 201 to 3
    expect(newY).toBe(y);
  });
});
