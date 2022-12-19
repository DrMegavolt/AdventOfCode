import { readFileSync } from "fs";
const input = readFileSync("./input.txt", "utf8");
// parse input
const lines = input.split("\n");
let commands = [];
for (let i = 0; i < lines.length; i++) {
  let [command, count] = lines[i].split(" ");
  commands.push([command, parseInt(count)]);
}
function updateCRT(CRT, tick, register) {
  // if (tick < 0 || tick >= 240) return;
  let row = Math.floor(tick / 40);
  let col = tick % 40;

  if (buildSprite(register)[col] === "#") {
    CRT[row].push("#");
  } else {
    CRT[row].push(".");
  }
}

let readPoints = [20, 60, 100, 140, 180, 220];
let registers = new Map();
// cpu clock ticket
let commandId = 0;
let register = 1;
let delay = 0;
let CRT = [["#"], [], [], [], [], []]; // CRT Draws on cycle zero, but commands run from 1
for (let i = 1; i < 240; i++) {
  // for each tick execute next command
  // read value from register every readPoint
  if (readPoints.includes(i + 1)) {
    console.log("register=", register);
    registers.set(i + 1, register);
  }
  // for whatever reason the clock count is off by 1, see task10.js
  // where the clock starts from 2 and this works
  // so I'm adding 1 to the tick count here

  updateCRT(CRT, i, register);

  let c = commands[commandId] || ["noop", 0];
  let [command, count] = c;
  // if (i >= 177) {
  //   console.log(
  //     "tick=",
  //     i,
  //     "command=",
  //     commandId,
  //     command,
  //     "count=",
  //     count,
  //     "register=",
  //     register,
  //     "delay=",
  //     delay
  //   );
  // }
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

// correct is:
//registers= Map(6) {
//   20 => 29,
//   60 => 17,
//   100 => 21,
//   140 => 21,
//   180 => 21,
//   220 => 17
// }
// signalStrength= 14160

console.log("signalStrength=", calculateSignalStrength(registers));

function buildSprite(register) {
  let sprite = [];
  for (let i = 0; i < 40; i++) {
    if (i === register || i === register + 1 || i === register - 1) {
      sprite.push("#");
    } else {
      sprite.push(".");
    }
  }
  return sprite;
}

console.log(CRT.map((row) => row.join("")));
