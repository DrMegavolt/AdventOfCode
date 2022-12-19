import { readDataLines } from "../common/index.js";
const lines = readDataLines("day16/input.txt");
const extractValveInfo = (string) => {
  const [valveInfo, tunnels] = string.split(";");
  let name = valveInfo.split(" ")[1];
  let rate = valveInfo.split("=")[1];

  const tunnelNames = tunnels.match(/[A-Z]+/g);

  // Return an object containing the valve name, flow rate, and tunnel names
  return {
    name,
    rate: parseInt(rate),
    tunnelNames,
  };
};

let map = new Map();
for (let line of lines) {
  let room = extractValveInfo(line);
  map.set(room.name, room);
}
console.log(map);

// let time = 30; //minutes

function calculateFlowRate(flowRate, time) {
  let flow = flowRate * time;
  return flow;
}

function bfs(roomName1, roomName2, map) {
  // find shortest path between rooms
  //return path cost
  if (roomName1 === roomName2) {
    return 0;
  }

  let queue = [[roomName1]];
  let visited = new Set();

  //   queue.push(...map.get(roomName1).tunnelNames);
  //   visited.add(roomName1);

  let pathCost = 0;
  while (queue.length > 0) {
    let current = queue.shift(); // return array of tunnel names
    // console.log(current);

    let deeperTunnels = [];
    for (let tunnel of current) {
      if (!visited.has(tunnel)) {
        if (tunnel === roomName2) {
          return pathCost;
        }
        deeperTunnels.push(...map.get(tunnel).tunnelNames);
        visited.add(tunnel);
      }
    }
    queue.push(deeperTunnels);

    pathCost++;
  }
  return -1;
}
// console.log(
//   bfs("AA", "BB", map),
//   bfs("AA", "JJ", map),
//   bfs("AA", "HH", map),
//   bfs("AA", "GG", map)
// );

let rooms = [...map.keys()];
let connections = new Map();
for (const room of rooms) {
  connections.set(room, new Map());
  for (const otherRoom of rooms) {
    let p = bfs(room, otherRoom, map);
    connections.get(room).set(otherRoom, p);
  }
}
let roomsWithFlow = [...map.values()].filter((x) => x.rate > 0);
/// max next flow rate
// t = time that will left of arrival (current_time - travel_time(get from connections map) - open_time(1min)) )
// t* flow_rate = max_flow_rate

// console.log(roomsWithFlow);

let roomNames = roomsWithFlow.map((x) => x.name);
console.log(connections);

console.log("-----", roomNames.length);

// let path2 = permutator(roomNames);
// let path1 = [["BB", "JJ", "DD", "HH", "EE", "CC"]];

// let p1 = ["DD", "HH", "EE"];
// let p2 = ["JJ", "BB", "CC"];

function calculatePathCost(p1) {
  // console.log("WORKING ON ", p1);
  let next1 = "AA";
  let next2 = "AA";
  let time1 = 0;
  let time2 = 0;

  let totalFlow1 = 0;
  let totalFlow2 = 0;
  let visited = [];
  for (let t = 0; t < 26; t++) {
    if (time1 === t) {
      let current1 = next1;
      // open valve
      next1 = p1.shift();

      totalFlow1 += calculateFlowRate(map.get(current1).rate, 26 - t);
      if (next1) {
        let distance1 = connections.get(current1).get(next1);
        // console.log("FROM", current1, next1, distance1);
        time1 += distance1 + 1;
      }
      next1 && visited.push(next1);
    }
    if (time2 === t) {
      let current2 = next2;
      // open valve
      totalFlow2 += calculateFlowRate(map.get(current2).rate, 26 - t);
      next2 = p1.shift();

      if (next2) {
        let distance2 = connections.get(current2).get(next2);
        // console.log("FROM", current2, next2, distance2);
        time2 += distance2 + 1;
      }
      next2 && visited.push(next2);
    }
  }
  return { totalFlow1, totalFlow2, total: totalFlow1 + totalFlow2, visited };
}

let max = 0;
let maxp1 = [];
let maxVisited = new Set();
let maxL = 10;
function permutations(array, L) {
  // base case: if L is 0, return an empty array
  if (L === 0) {
    return [[]];
  }

  // recursive case: initialize an empty result array
  let result = [];

  // for each element in the array
  for (let i = 0; i < array.length; i++) {
    if (array.length === maxL) {
      // console.log("DROP", i, result.length);
      result = [];
    }
    // get all the permutations of length L-1 from the subarray
    // that excludes the current element
    let subPermutations = permutations(
      array.slice(0, i).concat(array.slice(i + 1)),
      L - 1
    );

    // for each subpermutation, add the current element as the first element
    for (let j = 0; j < subPermutations.length; j++) {
      // result.push([array[i]].concat(subPermutations[j]));
      let m = [array[i]].concat(subPermutations[j]);
      let { total, visited } = calculatePathCost([...m]);
      result.push(m);

      // console.log(visited);
      // console.log(total);
      if (total > max) {
        max = total;
        maxp1 = m;
        maxVisited = visited;
      }
    }
  }
  if (result.length > 10000) {
    console.log("XXX", result.length);
  }

  return result;
}
permutations(roomNames, maxL);
console.log(max, maxp1, maxVisited);
