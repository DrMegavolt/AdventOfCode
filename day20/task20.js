import { readDataLines } from "../common/index.js";
const lines = readDataLines("day20/input.txt");
let numbers = [];
for (let line of lines) {
  numbers.push(parseInt(line));
}
let l = numbers.length;

let sequence = new Array(l).fill().map((_, i) => i);

// console.log(sequence);
print(sequence);

for (let i = 0; i < l; i++) {
  let a = numbers[i];
  move(sequence, i, a);
}
part1(sequence);
function move(sequence, i, a) {
  let l = sequence.length;
  let pos = sequence.indexOf(i);
  let target = (pos + a + l - 1) % (l - 1); // make sure target is always positive and in range

  let tmp = sequence.splice(pos, 1); // remove element at pos
  sequence.splice(target, 0, tmp[0]); // insert element at target
}

function print(sequence) {
  let l = sequence.length;
  let arr = new Array();
  let result = "";
  for (let i = 0; i < l; i++) {
    let index = sequence[i];
    result += numbers[index] + " ";
    arr.push(numbers[index]);
  }
  //   console.log(result);
  return arr;
}

function part1(sequence) {
  console.log("FINAL");
  console.log("------");
  let arr = print(sequence);

  let zero = arr.indexOf(0);
  let x1000 = (1000 + zero) % arr.length;
  let x2000 = (2000 + zero) % arr.length;
  let x3000 = (3000 + zero) % arr.length;
  //   console.log("target", effectiveMove);
  console.log("result 1000", arr[x1000]);
  console.log("result 2000", arr[x2000]);
  console.log("result 3000", arr[x3000]);
  console.log("result part1", arr[x1000] + arr[x2000] + arr[x3000]);
}

sequence = new Array(l).fill().map((_, i) => i);
let decriptionKey = 811589153;
numbers = numbers.map((n) => n * decriptionKey);
for (let p = 0; p < 10; p++) {
  for (let i = 0; i < l; i++) {
    let a = numbers[i];

    move(sequence, i, a);
  }
  print(sequence);
}
part1(sequence);
