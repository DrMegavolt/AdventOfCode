import { readDataLines } from "../common/index.js";
// parse input
const lines = readDataLines("day25/input.txt");
const snafuDigits = [
  { digit: "2", value: 2 },
  { digit: "1", value: 1 },
  { digit: "0", value: 0 },
  { digit: "-", value: -1 },
  { digit: "=", value: -2 },
];
let input = [];
for (let l of lines) {
  let n10 = SNAFUtoHUMAN(l);

  //   console.log(l, "->", n10, "->", HUMANtoSNAFU(n10));
  input.push(n10);
}

let output = input.reduce((acc, n) => {
  return acc + n;
}, 0);

// output *= 100000;
console.log(output);
console.log("PART1 SNAFU=", HUMANtoSNAFU(output));

function SNAFUtoHUMAN(l) {
  let number = [...l].map((c) => snafuDigits.find((x) => x.digit === c).value);
  let n10 = 0;
  for (let i = 0; i < number.length; i++) {
    n10 += number[i] * 5 ** (number.length - i - 1);
  }
  return n10;
}

function HUMANtoSNAFU(num) {
  console.log("-----");
  let base = 5;
  let x = 0;
  let bases = [];
  while (base ** x < num) {
    bases.unshift(base ** x);
    x++;
  }
  bases.unshift(base ** x);
  //   console.log(bases.map((x) => 2 * x - num));

  let dfs = (bases, num) => {
    let digits = [2, 1, 0, -1, -2];
    if (bases.length === 0) {
      return [[0, []]];
    }
    let b = bases.shift();

    let result = [];
    let maxPossibleRest = bases.reduce((acc, x) => acc + 2 * x, 0);
    for (let d of digits) {
      let rest = num - d * b;
      if (rest < -maxPossibleRest || rest > maxPossibleRest) {
        // console.log("skipping", num, d, rest, maxPossibleRest);

        continue;
      }
      let subRes = dfs([...bases], rest);

      for (let [sum, snafu] of subRes) {
        let s = d * b + sum;
        let newSnafu = [d, ...snafu];
        result.push([s, newSnafu]);
      }
    }
    return result;
  };

  let r = dfs(bases, num).filter((x) => x[0] === num)[0][1];
  if (!r) {
    throw new Error("Invalid number");
  }
  if (r[0] === 0) {
    r.shift();
  }
  let snafuNumber = r.map((x) => snafuDigits.find((y) => y.value === x).digit);
  return snafuNumber.join("");
}
