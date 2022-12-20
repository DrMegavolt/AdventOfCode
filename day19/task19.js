// if you get an error like NewSpace::Rebalance Allocation failed - JavaScript heap out of memory
// sudo sysctl -w vm.max_map_count=655300
//

// expect RAM usage ~40GB at peak and runtime ~1h
// TODO rewrite with BFS
import { readDataLines, BigMap } from "../common/index.js";
import { Worker } from "worker_threads";
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

let processes = [];
for (let bp of blueprints.values()) {
  //   let r = testBlueprint(bp, worktime);
  //   part1 += r * bp.id;
  processes.push(doTestBlueprint(bp));
}
await Promise.all(processes).then((results) => {
  console.log("RESULTS", results);
  for (let r of results) {
    part1 += r.geodes * r.id;
  }
});

console.log("PART 1", part1); // 1413 for input
function doTestBlueprint(bp) {
  return new Promise((resolve, reject) => {
    const worker = new Worker("./day19/worker19.js", {
      workerData: { blueprint: bp, time: 24 },
    });

    worker.on("message", resolve);
    worker.on("error", reject);
    worker.on("exit", (code) => {
      if (code !== 0) {
        reject(new Error(`stopped with exit code ${code}`));
      }
    });
  });
}
