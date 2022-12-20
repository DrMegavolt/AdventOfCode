import { workerData, parentPort } from "worker_threads";
import { readDataLines, BigMap } from "../common/index.js";
let worktime = 24;

// you can do intensive sychronous stuff here
function theCPUIntensiveTask({ blueprint, time }) {
  let k = testBlueprint(blueprint, time);

  return { id: blueprint.id, geodes: k };
}

const intensiveResult = theCPUIntensiveTask(workerData);

parentPort.postMessage(intensiveResult);

function testBlueprint(bp, time) {
  console.log("TESTING", bp.id, time);
  let cache = new BigMap();
  let bfs = (bp, time, resources, robots) => {
    if (time < 0) {
      return resources.geode;
    }
    let key = `${time}-${resources.ore}-${resources.clay}-${resources.obsidian}-${resources.geode}-${robots.ore}-${robots.clay}-${robots.obsidian}-${robots.geode}`;
    // console.log(key);
    if (cache.has(key)) {
      //   console.log("cache hit", cache.get(key));
      return cache.get(key);
    }

    // mine resources
    let newResources = { ...resources };
    for (let robot of bp.robotSpecs) {
      newResources[robot.production] += robots[robot.production] * robot.rate;
    }

    // build ore robots

    // if enough resources build ore robot or skip
    // if enough resources build clay robots or skip
    // if enough resources build obsidian robots or skip
    // if enough resources build geode robots or skip

    let maxGeode = newResources.geode;
    let skip = bfs(bp, time - 1, newResources, { ...robots });
    maxGeode = Math.max(maxGeode, skip);

    // or collect resources, wait 1 miute for robot to build
    for (let robot of bp.robotSpecs) {
      // test build vs skip
      if (
        resources.ore < robot.ore ||
        resources.clay < robot.clay ||
        resources.obsidian < robot.obsidian
      ) {
        continue;
      }

      let res = { ...newResources };
      let newRobots = { ...robots };
      newRobots[robot.production] += 1;
      res.ore -= robot.ore;
      res.clay -= robot.clay;
      res.obsidian -= robot.obsidian;
      // console.log(worktime - time, "build", robot.production, res, newRobots);
      let build = bfs(bp, time - 1, res, newRobots);
      maxGeode = Math.max(maxGeode, build);
    }
    cache.set(key, maxGeode);
    return maxGeode;
  };
  let resources = {
    ore: 0,
    clay: 0,
    obsidian: 0,
    geode: 0,
  };
  let robots = {
    ore: 1,
    clay: 0,
    obsidian: 0,
    geode: 0,
  };
  return bfs(bp, time - 1, resources, robots);
}
