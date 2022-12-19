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

function shortestPathBetweenRooms() {
  // find shortest path between rooms
  //return path cost
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
// console.log(connections);
let roomsWithFlow = [...map.values()].filter((x) => x.rate > 0);
/// max next flow rate
// t = time that will left of arrival (current_time - travel_time(get from connections map) - open_time(1min)) )
// t* flow_rate = max_flow_rate

console.log(roomsWithFlow);

function travel(start, time, visited) {
  let max = 0;
  for (let room of roomsWithFlow) {
    if (visited.includes(room.name)) {
      continue;
    }
    let shortestPath = connections.get(start).get(room.name);

    let flow = calculateFlowRate(room.rate, time - shortestPath - 1);
    if (flow <= 0) {
      continue;
    }
    console.log(
      flow,
      shortestPath,
      room.name,
      room.rate,
      time - shortestPath - 1
    );
    console.log("visited", visited, start, room.name);
    let vis = [...visited];
    vis.push(room.name);
    let next = travel(room.name, time - shortestPath - 1, vis);
    if (flow + next > max) {
      max = flow + next;
    }
  }
  return max;
}

let start = "AA";
let res = travel(start, 30, [start]);
console.log("PART 1: ", res);
