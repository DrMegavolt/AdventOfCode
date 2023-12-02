// the trick for the second part is to avoid using Big numbers
// even embedded BigInt is not big enough for this task
// libs like bignumber.js are too slow for this task
// I've tried and it takes hours to reach 1000 cycles

// I've seen how it was solved https://github.com/hyper-neutrino/advent-of-code/blob/main/2022/day11p2.py#L22
// the trick is to constantly devide the number by multiplication of all `divisible by X` numbers
// and take the remainder

// 1 % 13 = 1 ;
// 14 % 13 = 1 ;
// 27 % 13 = 1 ;
// 40 % 13 = 1 ;
// so for our purposes we can just take the remainder of the number
// it will not affect the divisible by test
// we just need to consider all possible devidors

// Monkey.mod = 1;
// for (let [monkeyId, monkey] of monkeys) {
//   Monkey.mod *= monkey.divisibleBy;
// }

import { readFileSync } from "fs";
const input = readFileSync("./input.txt", "utf8");
// parse input

class Monkey {
  constructor(sixLines) {
    this.id = parseInt(sixLines[0].split(" ")[1]);
    this.items = sixLines[1].match(/\d+/g).map((x) => parseInt(x));

    let ops = sixLines[2].split(" ").slice(-3);
    this.ops = ops;
    this.op = (old) => {
      let [a1, op, a2] = ops;
      let a = old;
      let b = a2 === "old" ? old : parseInt(a2);
      //   console.log("op", a, op, b, "=", op === "+" ? a + b : a * b);
      return op === "+" ? a + b : a * b;
    };

    this.divisibleBy = parseInt(sixLines[3].split(" ").slice(-1));
    this.inspectedCount = 0;
    this.conditionTrue = parseInt(sixLines[4].split(" ").slice(-1));
    this.conditionFalse = parseInt(sixLines[5].split(" ").slice(-1));
    this.throwTo = (item) => {
      return item % this.divisibleBy === 0
        ? this.conditionTrue
        : this.conditionFalse;
    };
  }
  static mod = 1;

  inspect(item) {
    this.inspectedCount++;
    let worrylevel = this.op(item);
    worrylevel = worrylevel % Monkey.mod;

    return { nextMonkey: this.throwTo(worrylevel), worrylevel };
  }

  inspectAll() {
    let nextMonkeys = new Map();
    let item;
    // console.log("++++++++++++++++++");
    // console.log(this.id, this.items);
    while ((item = this.items.pop())) {
      let { nextMonkey, worrylevel } = this.inspect(item);
      if (nextMonkeys.has(nextMonkey)) {
        nextMonkeys.get(nextMonkey).push(worrylevel);
      } else {
        nextMonkeys.set(nextMonkey, [worrylevel]);
      }
    }

    // console.log(this.id, nextMonkeys);
    // this.items = [];
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

  let sixLines = lines.slice(i, i + 6);
  i += 6;
  let m = new Monkey(sixLines);
  monkeys.set(m.id, m);
}
// console.log(monkeys);
// console.log("------------------");
for (let [monkeyId, monkey] of monkeys) {
  Monkey.mod *= monkey.divisibleBy;
}

for (let i = 1; i <= 10000; i++) {
  //   console.log("round ", i);
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
// console.log(monkeys);
console.log("PART 1 answer = ", monkeyBusinessScore(monkeys));
