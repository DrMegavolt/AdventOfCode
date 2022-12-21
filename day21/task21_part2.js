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
numberMonkeys.delete("humn");
let deletes = 1;
while (deletes > 0) {
  deletes = 0;
  for (let [monkey, op] of opMonkeys) {
    let [m1, type, m2] = op;
    if (m1 === "humn" || m2 === "humn") {
      continue;
    }
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
      deletes++;
    }
  }
}

for (let [monkey, op] of opMonkeys) {
  let [m1, type, m2] = op;
  if (numberMonkeys.has(m1)) {
    op[0] = numberMonkeys.get(m1);
  }
  if (numberMonkeys.has(m2)) {
    op[2] = numberMonkeys.get(m2);
  }
  opMonkeys.set(monkey, op);
}
let [r1, _, r2] = opMonkeys.get("root");
opMonkeys.delete("root");

let result = typeof r1 === "number" ? r1 : r2;
let monkeyName = typeof r1 === "number" ? r2 : r1;
numberMonkeys.set(monkeyName, result);

while (opMonkeys.size > 0) {
  for (let [monkey, op] of opMonkeys) {
    let [a, type, b] = op;
    if (!numberMonkeys.has(monkey)) {
      continue;
    }
    let left = numberMonkeys.get(monkey);

    let isAknown = typeof a === "number";
    let key = isAknown ? b : a;

    let val = null;
    switch (type) {
      case "+":
        // left = a + b
        // a = left - b
        // b = left - a
        val = left - (isAknown ? a : b);
        break;
      case "-":
        // left = a - b
        // a = left + b
        // b = a - left
        val = isAknown ? a - left : b + left;
        break;
      case "*":
        // left = a * b
        // a = left / b
        // b = left / a
        val = left / (isAknown ? a : b);
        break;
      case "/":
        // left = a / b
        // a = left * b
        // b = a / left
        val = isAknown ? a / left : left * b;
        break;
    }
    numberMonkeys.set(key, val);
    opMonkeys.delete(monkey);
  }
}

console.log("PART2:", numberMonkeys.get("humn")); //3272260914328
