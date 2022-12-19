// ULTRA SLOW
// expect days to finish, do not use
// use task11_part2.js instead

import { readFileSync } from "fs";
import BigNumber from "big-number";
const input = readFileSync("./input_test.txt", "utf8");
// parse input

class Monkey {
  constructor(sixLines) {
    this.id = parseInt(sixLines[0].split(" ")[1]);
    this.items = sixLines[1].match(/\d+/g).map((x) => BigNumber(parseInt(x)));

    let ops = sixLines[2].split(" ").slice(-3);
    this.ops = ops;
    let [a1, op, a2] = ops;
    let x = parseInt(a2);
    this.op = (old) => {
      let a = BigNumber(old);
      let b = a2 === "old" ? old : x;
      return op === "+" ? a.add(b) : a.mult(b);
    };

    this.divisibleBy = parseInt(sixLines[3].split(" ").slice(-1));
    this.inspectedCount = 0;
    this.conditionTrue = parseInt(sixLines[4].split(" ").slice(-1));
    this.conditionFalse = parseInt(sixLines[5].split(" ").slice(-1));
    this.throwTo = (item) => {
      return BigNumber(item).mod(this.divisibleBy).equals(0)
        ? this.conditionTrue
        : this.conditionFalse;
    };
  }

  inspect(item) {
    this.inspectedCount++;
    let worrylevel = this.op(item);

    return { nextMonkey: this.throwTo(worrylevel), worrylevel };
  }

  inspectAll() {
    let nextMonkeys = new Map();
    let item;

    while ((item = this.items.shift())) {
      let { nextMonkey, worrylevel } = this.inspect(item);
      if (nextMonkeys.has(nextMonkey)) {
        nextMonkeys.get(nextMonkey).push(worrylevel);
      } else {
        nextMonkeys.set(nextMonkey, [worrylevel]);
      }
    }

    // console.log(this.id, nextMonkeys);
    return nextMonkeys;
  }
}
let monkeys = new Map();
const lines = input.split("\n");
let i = 0;
while (i < lines.length) {
  if (lines[i] === "") {
    i++;
    continue;
  }
  // keep digits in sixLines[1] via regex

  let sixLines = lines.slice(i, i + 6);
  i += 6;
  let m = new Monkey(sixLines);
  monkeys.set(m.id, m);
}
// console.log(monkeys);
// console.log("------------------");

for (let i = 1; i <= 1000; i++) {
  console.log("round ", i);
  for (let [monkeyId, monkey] of monkeys) {
    let nextMonkeyItems = monkey.inspectAll();

    for (let [nextMonkeyId, mItems] of nextMonkeyItems) {
      monkeys.get(nextMonkeyId).items.push(...mItems);
    }
  }
}
function monkeyBusinessScore(monkeys) {
  let scores = [...monkeys]
    .map((m) => m[1].inspectedCount)
    .sort((a, b) => a - b)
    .slice(-2);

  return scores[0] * scores[1];
}
console.log(
  [...monkeys].map(([k, v]) => {
    return {
      id: k,
      items: v.items.map((x) => x.toString()),
      inspectedCount: v.inspectedCount,
    };
  })
);

console.log("PART 2 answer = ", monkeyBusinessScore(monkeys));
