import { readDataLines } from "../common/index.js";
// parse input
const lines = readDataLines("day13/input.txt");

let pairs = [];
let messages = [];
for (let i = 0; i < lines.length; i += 3) {
  let pair = [JSON.parse(lines[i]), JSON.parse(lines[i + 1])];
  pairs.push(pair);
  messages.push(pair[0]);
  messages.push(pair[1]);
}

let validIndeces = [];
for (let i = 0; i < pairs.length; i++) {
  const element = pairs[i];
  let [a, b] = element;
  if (isValidOrder(a, b)) {
    validIndeces.push(i + 1);
  }
}

function isValidOrder(a, b) {
  return compare(a, b) === -1;
}

function compare(a, b) {
  //   console.log("comparing: ", a, b);

  if (a === undefined && b === undefined) {
    return 0;
  }
  if (a === undefined) {
    return -1;
  }
  if (b === undefined) {
    return 1;
  }
  if (!Array.isArray(a) && !Array.isArray(b)) {
    // both are numbers
    if (a === b) {
      return 0;
    }
    return a < b ? -1 : 1;
  }
  if (!Array.isArray(a) && Array.isArray(b)) {
    return compare([a], b);
  }
  if (Array.isArray(a) && !Array.isArray(b)) {
    return compare(a, [b]);
  }

  for (let i = 0; i < Math.max(a.length, b.length); i++) {
    let c = compare(a[i], b[i]);
    // console.log("   inner compare: ", a[i], b[i], c);
    if (c !== 0) {
      return c;
    }
  }
  return 0;
}

console.log(
  "part 1 ---",
  validIndeces.reduce((a, b) => a + b, 0)
);

messages.push([[2]]);
messages.push([[6]]);
let sorted = messages.sort((a, b) => compare(a, b));
let i1 = sorted.findIndex((x) => compare(x, [[2]]) === 0) + 1;
let i2 = sorted.findIndex((x) => compare(x, [[6]]) === 0) + 1;
console.log("part 2 ---", i1 * i2);
