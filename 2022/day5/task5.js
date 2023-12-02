import { readFileSync } from "fs";
const input = readFileSync("./crane.txt", "utf8");
// parse input
const lines = input.split("\n");

let isInstructions = false;
let stacks = [];
let instructions = [];
for (let line of lines) {
  if (line === "") {
    isInstructions = true;
    continue;
  }
  if (!isInstructions) {
    stacks.push(line);
  } else {
    let ins = line.split(" ");
    instructions.push({
      quantity: ins[1],
      from: ins[3],
      to: ins[5],
    });
  }
}
// console.log(instructions);

let containers = parseStacks(stacks);

function parseStacks(stacks) {
  let l = stacks[0].length / 4;

  let containers = [[]];
  for (let pos = 0; pos < l; pos++) {
    let containerColumn = [];
    for (let id = stacks.length - 2; id >= 0; id--) {
      let stack = stacks[id];

      console.log(stack);

      let container = stack.slice(pos * 4, pos * 4 + 4);

      let c = container[1];
      if (c != " ") {
        containerColumn.push(c);
      }
    }
    containers.push(containerColumn);
  }

  return containers;
}

console.log(containers);

function operateCrane9000(instructions) {
  for (let instruction of instructions) {
    let { quantity, from, to } = instruction;
    for (let i = 0; i < quantity; i++) {
      let container = containers[from].pop();
      containers[to].push(container);
    }
    //   console.log
  }
}
function operateCrane9001(instructions) {
  for (let instruction of instructions) {
    let { quantity, from, to } = instruction;
    let tmp = [];
    for (let i = 0; i < quantity; i++) {
      let container = containers[from].pop();
      tmp.unshift(container);
    }
    containers[to].push(...tmp);
    //   console.log
  }
}

let result = operateCrane9001(instructions);
console.log(containers);

function getTopContainers(containers) {
  let topContainers = [];
  for (let container of containers) {
    topContainers.push(container[container.length - 1]);
  }
  return topContainers;
}

console.log(getTopContainers(containers).join(""));
