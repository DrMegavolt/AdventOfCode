import { readFileSync } from "fs";
const input = readFileSync("./input.txt", "utf8");
// parse input
const lines = input.split("\n");
let forest = [];
for (let i = 0; i < lines.length; i++) {
  forest.push(lines[i].split(""));
}
let h = forest.length;
let w = forest[0].length;

let topTrees = new Set();
let edgeTrees = (h - 1) * 2 + (w - 1) * 2;
for (let k = 1; k < h - 1; k++) {
  let row = forest[k];
  let maxHeightLeft = row[0];
  let maxHeightRight = row[w - 1];

  for (let i = 1; i < w - 1; i++) {
    let height = row[i];
    if (height > maxHeightLeft) {
      topTrees.add(`${k},${i}`);
      maxHeightLeft = height;
    }
  }
  for (let i = w - 2; i >= 1; i--) {
    let height = row[i];
    if (height > maxHeightRight) {
      topTrees.add(`${k},${i}`);
      maxHeightRight = height;
    }
  }
  // line 97
  // 100122131000211034223301034012415322234122154143522313235545255134155143122000321242010032132112010
  // line 98
  // 022210130000131121100420203411431312433123144335254451454421435455333142200104132010113111122222121
}
for (let j = 1; j < w - 1; j++) {
  let maxHeightTop = forest[0][j];
  let maxHeightBottom = forest[h - 1][j];
  for (let i = 1; i < h - 1; i++) {
    let height = forest[i][j];
    if (height > maxHeightTop) {
      topTrees.add(`${i},${j}`);
      maxHeightTop = height;
    }
  }
  for (let i = h - 2; i >= 1; i--) {
    let height = forest[i][j];
    if (height > maxHeightBottom) {
      topTrees.add(`${i},${j}`);
      maxHeightBottom = height;
    }
  }
}

console.log("part 1 answer", topTrees.size + edgeTrees);

function caclulateScenicScore(forest, x, y) {
  let h = forest.length;
  let w = forest[0].length;
  let treeHeight = forest[x][y];
  let visibleTreesRight = 0;
  let visibleTreesLeft = 0;
  let visibleTreesTop = 0;
  let visibleTreesBottom = 0;
  for (let i = x + 1; i < h; i++) {
    visibleTreesBottom++;

    if (forest[i][y] >= treeHeight) {
      break;
    }
  }
  for (let i = x - 1; i >= 0; i--) {
    visibleTreesTop++;
    if (forest[i][y] >= treeHeight) {
      break;
    }
  }

  for (let i = y + 1; i < w; i++) {
    visibleTreesRight++;
    if (forest[x][i] >= treeHeight) {
      break;
    }
  }
  for (let i = y - 1; i >= 0; i--) {
    visibleTreesLeft++;
    if (forest[x][i] >= treeHeight) {
      break;
    }
  }

  return (
    visibleTreesRight * visibleTreesLeft * visibleTreesTop * visibleTreesBottom
  );
}
let scores = [];
for (let tr of topTrees) {
  let [x, y] = tr.split(",").map((x) => parseInt(x));
  scores.push(caclulateScenicScore(forest, x, y));
}
console.log("part2 answer", Math.max(...scores));
