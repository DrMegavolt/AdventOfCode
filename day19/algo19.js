import { BigMap } from "../common/index.js";

export function testBlueprint(bp, time) {
  console.log("TESTING", bp.id, time);
  console.log(bp.robotSpecs);
  let maxtime = time;
  let hits = 0;
  let cache = new Map();
  let maxProductionRequired = {
    ore: Math.max(...bp.robotSpecs.map((x) => x.ore)),
    clay: Math.max(...bp.robotSpecs.map((x) => x.clay)),
    obsidian: Math.max(...bp.robotSpecs.map((x) => x.obsidian)),
    geode: 1000000,
  };

  let bfs = (bp, time, resources, robots) => {
    if (time < 0) {
      return resources.geode;
    }

    if (robots.clay >= maxProductionRequired.clay) {
      // we will produce new obsidian or geode robot for each next turn
      // priority to geode

      let obsidianCostPerRobot = bp.robotSpecs.find(
        (x) => x.production === "geode"
      ).obsidian;

      for (let t = 1; t < time; t++) {
        if (resources.obsidian >= obsidianCostPerRobot) {
          resources.obsidian -= obsidianCostPerRobot;
          robots.geode++;
        } else {
          robots.obsidian++; // we have unlimited clay, we can make a new obsidian robot
        }
        resources.geode += robots.geode;
        resources.obsidian += robots.obsidian; // *rate = 1
      }
      return resources.geode;
    }

    if (robots.obsidian >= maxProductionRequired.obsidian) {
      // we will produce new geode robot for each next turn
      ///
      // current geode robots 5
      // next robots: 6 production 5
      // next robots: 7 production 6
      // next robots: 8 production 7
      // 5+6+7+8 = 26 (5+8)/2 *4 = 26;  5+5+5+5+0+1+2+3 = 26;
      // n*t+(t-1)*t/2 , with n=5 t=4 => 5*4+3*4/2 = 26
      // 5+6+7+8+9 = 35 (5+9)/2 *5 = 35
      //   console.log("maxtime production of obsidian", robots.obsidian);
      let n = robots.geode;
      let t = time;

      return resources.geode + n * t + ((t - 1) * t) / 2;
    }

    // we can skip geode robots in key, it will be computed later +50% speed
    // looks like we can skip robots.obsidian too? WHY? +50% speed
    let key = `${time}-${resources.ore}-${resources.clay}-${resources.obsidian}-${robots.ore}-${robots.clay}`;
    // let key = `${time}-${resources.ore}-${resources.clay}-${resources.obsidian}-${robots.ore}-${robots.clay}-${robots.obsidian}`;
    // console.log(key);
    if (cache.has(key)) {
      hits++;
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

    // let robotWasBuilt = false;
    for (let robot of bp.robotSpecs) {
      if (robots[robot.production] >= maxProductionRequired[robot.production]) {
        continue; // skip if max production reached
      }
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
      let build = bfs(bp, time - 1, res, newRobots);
      //   robotWasBuilt = true;
      maxGeode = Math.max(maxGeode, build);
    }
    // if (!robotWasBuilt) {
    let skip = bfs(bp, time - 1, newResources, { ...robots });
    maxGeode = Math.max(maxGeode, skip);
    // }

    cache.set(key, maxGeode);
    return maxGeode;
  };

  let robots = {
    ore: 1,
    clay: 0,
    obsidian: 0,
    geode: 0,
  };

  let startingOreRequired = Math.min(
    ...bp.robotSpecs
      .filter((x) => x.production === "ore" || x.production === "clay")
      .map((x) => x.ore)
  );
  let resources = {
    ore: startingOreRequired,
    clay: 0,
    obsidian: 0,
    geode: 0,
  };

  let out = bfs(bp, time - 1 - startingOreRequired, resources, robots);
  console.log("cache hits", hits, cache.size, hits / cache.size);
  return out;
}
