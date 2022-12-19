import { readFileSync } from "fs";
const input = readFileSync("./input.txt", "utf8");
// parse input

class Monkey {
  constructor(sixLines) {
    this.id = parseInt(sixLines[0].split(" ")[1]);
    this.items = sixLines[1].match(/\d+/g).map((x) => parseInt(x));

    let ops = sixLines[2].split(" ").slice(-3);
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
      //   console.log(
      //     item,
      //     item % this.divisibleBy,
      //     item % this.divisibleBy === 0,
      //     this.conditionTrue,
      //     this.conditionFalse
      //   );
      return item % this.divisibleBy === 0
        ? this.conditionTrue
        : this.conditionFalse;
    };
  }

  inspect(item) {
    this.inspectedCount++;
    let worrylevel = this.op(item);
    worrylevel = Math.floor(worrylevel / 3);

    return { nextMonkey: this.throwTo(worrylevel), worrylevel };
  }

  inspectAll() {
    let nextMonkeys = new Map();
    let item;
    while ((item = this.items.pop())) {
      let { nextMonkey, worrylevel } = this.inspect(item);
      if (nextMonkeys.has(nextMonkey)) {
        nextMonkeys.get(nextMonkey).push(worrylevel);
      } else {
        nextMonkeys.set(nextMonkey, [worrylevel]);
      }
    }

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

for (let i = 1; i <= 20; i++) {
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

console.log("PART 1 answer = ", monkeyBusinessScore(monkeys));
