import { readFileSync } from "fs";
const input = readFileSync("./input.txt", "utf8");
// parse input
const lines = input.split("\n");
let commands = [];
for (let i = 0; i < lines.length; i++) {
  let [command, count] = lines[i].split(" ");
  commands.push([command, parseInt(count)]);
}

let readPoints = [20, 60, 100, 140, 180, 220];
let registers = new Map();
// cpu clock ticket
let commandId = 0;
let register = 1;
let delay = 0;
for (let i = 2; i < 221; i++) {
  // for each tick execute next command
  // read value from register every readPoint
  if (readPoints.includes(i)) {
    console.log("register=", register);
    registers.set(i, register);
  }
  let [command, count] = commands[commandId];

  switch (command) {
    case "noop":
      commandId++;
      break;
    case "addx":
      if (delay > 0) {
        delay--;
      } else {
        register += count;
        delay = 1;
        commandId++;
      }
      break;
  }
}

console.log("registers=", registers);

function calculateSignalStrength(registers) {
  let signalStrength = 0;
  for (let [tick, value] of registers) {
    signalStrength += value * tick;
  }
  return signalStrength;
}

console.log("signalStrength=", calculateSignalStrength(registers));
