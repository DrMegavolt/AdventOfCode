import { readDataLines } from "../common/index.js";
// parse input
const lines = readDataLines("day21/input.txt");

let numberMonkeys = new Map();
let opMonkeys = new Map();
for (let line of lines) {
  let [monkey, op] = line.split(":");
  let ops = op.trim().split(" ");
  if (ops.length === 1) {
    numberMonkeys.set(monkey, parseInt(ops[0]));
  } else {
    opMonkeys.set(monkey, ops);
  }
}
// console.log(numberMonkeys);
// console.log(opMonkeys);

while (opMonkeys.size > 0) {
  for (let [monkey, op] of opMonkeys) {
    let [m1, type, m2] = op;
    if (numberMonkeys.has(m1) && numberMonkeys.has(m2)) {
      //   console.log(m1, m2, monkey);
      let n1 = numberMonkeys.get(m1);
      let n2 = numberMonkeys.get(m2);
      let result = 0;
      switch (type) {
        case "+":
          result = n1 + n2;
          break;
        case "-":
          result = n1 - n2;
          break;
        case "*":
          result = n1 * n2;
          break;
        case "/":
          result = n1 / n2;
          break;
      }
      numberMonkeys.set(monkey, result);
      opMonkeys.delete(monkey);
    }
  }
}
console.log(numberMonkeys.get("root"));
