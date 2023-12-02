import { testBlueprint } from "./algo19.js";
import { readDataLines, BigMap } from "../common/index.js";
// parse input
const lines = readDataLines("day19/input.txt");
class Blueprint {
  constructor(text) {
    let d = text.match(/(\d+)/g).map((n) => parseInt(n));

    this.id = d[0];
    this.robotSpecs = [
      { ore: d[1], clay: 0, obsidian: 0, production: "ore", rate: 1 },
      { ore: d[2], clay: 0, obsidian: 0, production: "clay", rate: 1 },
      {
        ore: d[3],
        clay: d[4],
        obsidian: 0,
        production: "obsidian",
        rate: 1,
      },
      {
        ore: d[5],
        clay: 0,
        obsidian: d[6],
        production: "geode",
        rate: 1,
      },
    ];
  }
}

let blueprints = new Map();
for (let line of lines) {
  let bp = new Blueprint(line);
  blueprints.set(bp.id, bp);
}

let part1 = 0;

for (let bp of blueprints.values()) {
  let r = testBlueprint(bp, 24);
  console.log(r);
  part1 += r * bp.id;
}

console.log("PART 1", part1); // 1413 for input
