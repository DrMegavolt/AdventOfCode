import { readDataLines } from "../common/index.js";
const lines = readDataLines("day16/input_test.txt");
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
  if (flow < 0) {
    return 0;
  }
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
  let pathCost = 0;
  while (queue.length > 0) {
    let current = queue.shift(); // return array of tunnel names
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

let roomNames = roomsWithFlow.map((x) => x.name);
// console.log(connections);

console.log("-----", roomNames.length);

// let p1 = ["DD", "HH", "EE"];
// let p2 = ["JJ", "BB", "CC"];

let destinations = [...roomNames];

class TreeNode {
  static TotalTime = 26;
  constructor(name, t1 = 0, t2 = 0, flow = 0) {
    this.name = name;
    this.t1 = t1;
    this.t2 = t2;

    this.flow = flow;
    this.visited = [];
  }
}

let queue = [];

let root = new TreeNode("AA");
queue.push(root);

let t = 0;
let maxFlow = 0;
while (queue.length > 0 && t < TreeNode.TotalTime) {
  let current = queue.shift();
  console.log(
    t,
    current.name,
    current.t1,
    current.t2,
    current.visited,
    current.flow
  );
  if (current.flow > maxFlow) {
    maxFlow = current.flow;
  }
  if (current.t1 === t || current.t2 === t) {
    // ready to move
    let dest = [...destinations].filter((x) => !current.visited.includes(x));
    for (let d of dest) {
      let walkingTime = connections.get(current.name).get(d);
      let tn = new TreeNode(d, current.t1, current.t2, current.flow);
      if (current.t1 === t) {
        tn.t1 += walkingTime + 1; // +1 for opening valve
      } else if (current.t2 === t) {
        tn.t2 += walkingTime + 1; // +1 for opening valve
      }
      // count for flow at the destination
      tn.flow += calculateFlowRate(
        map.get(d).rate,
        TreeNode.TotalTime - t - walkingTime - 1
      );
      tn.visited = [...current.visited, d];
      queue.push(tn);
    }
  } else {
    queue.push(current); // not ready yet
  }

  if (!queue.some((x) => x.t1 === t || x.t2 === t)) {
    t++;
    // console.log(queue);
    // break;
  }
}
console.log(maxFlow);
