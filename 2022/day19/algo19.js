export function testBlueprint(bp, time) {
  console.log("TESTING", bp.id, time);
  console.log(bp.robotSpecs);
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

    // likely the entire bfs can be replaced with the strategy to build the most expensive robot first
    // so far working with geode/obsidian robots
    if (robots.clay >= maxProductionRequired.clay) {
      // this is the key to make it fast
      // after we max out clay production, we can skip all clay robots and ore robots
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
