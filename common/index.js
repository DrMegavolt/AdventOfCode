import { readFileSync } from "fs";
export { BigMap } from "./BigMap.js";
export { BigSet } from "./BigSet.js";
import path from "path";

export function readData(folders) {
  console.log("READING:", path.resolve(folders));
  const input = readFileSync(path.resolve(folders), "utf8");
  return input;
}
export function readDataLines(folders) {
  const input = readData(folders);
  const lines = input.split("\n");
  return lines;
}

export function readDataAs2DArray(
  folders,
  options = { split: "", transform: null, skipEmpty: true }
) {
  const input = readData(folders);
  const lines = input.split("\n");
  const map = [];
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (options.skipEmpty && line === "") {
      continue;
    }
    map.push(line.split(options.split));
  }
  return map;
}

class FieldMap extends Map {
  constructor() {
    super();
    this.minX = 0;
    this.maxX = 0;
    this.minY = 0;
    this.maxY = 0;
  }
  #rescanDimmentions() {
    let minX = Infinity;
    let maxX = -Infinity;
    let minY = Infinity;
    let maxY = -Infinity;
    for (let [key, value] of this) {
      const [x, y] = key.split(",").map((x) => parseInt(x));
      if (x < minX) {
        minX = x;
      }
      if (x > maxX) {
        maxX = x;
      }
      if (y < minY) {
        minY = y;
      }
      if (y > maxY) {
        maxY = y;
      }
    }
    this.minX = minX;
    this.maxX = maxX;
    this.minY = minY;
    this.maxY = maxY;
  }
  get(x, y) {
    return super.get(`${x},${y}`) ?? ".";
  }
  set(x, y, value) {
    let v = super.set(`${x},${y}`, value);
    if (x < this.minX) {
      this.minX = x;
    }
    if (x > this.maxX) {
      this.maxX = x;
    }
    if (y < this.minY) {
      this.minY = y;
    }
    if (y > this.maxY) {
      this.maxY = y;
    }

    return v;
  }
  has(x, y) {
    return super.has(`${x},${y}`);
  }
  delete(x, y) {
    let v = super.delete(`${x},${y}`);
    this.#rescanDimmentions();
    return v;
  }
  print(options = { lineNumbers: true }) {
    let out = "";
    for (let x = this.minX; x <= this.maxX; x++) {
      if (options.lineNumbers) {
        out += x.toString().padEnd(4, " ");
      }
      for (let y = this.minY; y <= this.maxY; y++) {
        out += this.get(x, y) || ".";
      }
      out += "\n";
    }
    console.log(out);
  }
}

export function readDataAsMap(folders, options = null) {
  const mapIn = readDataAs2DArray(folders);
  let map = new Map();
  for (let x = 0; x < mapIn.length; x++) {
    for (let y = 0; y < mapIn[0].length; y++) {
      map.set(`${x},${y}`, mapIn[x][y]);
    }
  }
  return map;
}
export function readDataAsFieldMap(folders, options = null) {
  const mapIn = readDataAs2DArray(folders);
  let map = new FieldMap();
  for (let x = 0; x < mapIn.length; x++) {
    for (let y = 0; y < mapIn[0].length; y++) {
      map.set(x, y, mapIn[x][y]);
    }
  }
  return map;
}
