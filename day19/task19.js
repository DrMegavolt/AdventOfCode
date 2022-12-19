import { readDataLines } from "../common/index.js";
// parse input
const lines = readDataLines("day19/input_test.txt");
class Blueprint {
  constructor(text) {
    let d = text.match(/(\d+)/g).map((n) => parseInt(n));

    this.id = d[0];
    this.oreRobot = { ore: d[1], clay: 0, production: "ore", rate: 1 };
    this.clayRobot = { ore: d[2], clay: 0, production: "clay", rate: 1 };
    this.obsidianRobot = {
      ore: d[3],
      clay: d[4],
      production: "obsidian",
      rate: 1,
    };
    this.geodeRobot = {
      ore: d[5],
      clay: d[6],
      production: "geode",
      rate: 1,
    };
  }
}

let blueprints = new Map();
for (let line of lines) {
  let bp = new Blueprint(line);
  blueprints.set(bp.id, bp);
}
console.log(blueprints);

function testBlueprint(bp) {}
