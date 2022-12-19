import { readFileSync } from "fs";
const input = readFileSync("./assignments.txt", "utf8");
// parse input
const lines = input.split("\n");

function includes(r1, r2) {
  // r1_0 r2_0 r2_1 r1_1
  if (r1[0] <= r2[0] && r2[1] <= r1[1]) {
    return true;
  }
  if (r2[0] <= r1[0] && r1[1] <= r2[1]) {
    return true;
  }
  return false;
}
function overlap(r1, r2) {
  // r1_0 r2_0 r1_1
  if (r1[0] <= r2[0] && r2[0] <= r1[1]) {
    return true;
  }
  // r2_0 r1_0 r2_1
  if (r2[0] <= r1[0] && r1[0] <= r2[1]) {
    return true;
  }
  return false;
}

let containsCounter = 0;
let overlapCounter = 0;
for (let line of lines) {
  let [p1, p2] = line.split(",").map((x) => x.split("-"));

  p1 = p1.map((x) => parseInt(x));
  p2 = p2.map((x) => parseInt(x));
  if (includes(p1, p2)) {
    console.log("includes", p1, p2);

    containsCounter++;
  }
  if (overlap(p1, p2)) {
    console.log("overlap", p1, p2);
    overlapCounter++;
  }
}
console.log(containsCounter);
console.log(overlapCounter);
