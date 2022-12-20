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

export function readDataAsMap(
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
