import { BigMap } from "../common/index.js";

export function testBlueprint(bp, time) {
  console.log("TESTING", bp.id, time);
  console.log(bp.robotSpecs);
  let maxtime = time;
  let cache = new BigMap();
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
    // console.log(maxtime - time, "---", robots);

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
      console.log("maxtime production of obsidian", robots.obsidian);
      let n = robots.geode;
      let t = time;
      console.log(
        "time left",
        t,
        "result",
        resources.geode + n * t + ((t - 1) * t) / 2,
        "geodes"
      );

      return resources.geode + n * t + ((t - 1) * t) / 2;
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
      if (robots[robot.production] >= maxProductionRequired[robot.production]) {
        // console.log("skip", robot.production);
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
