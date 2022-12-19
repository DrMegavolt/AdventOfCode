import { readFileSync } from "fs";
const input = readFileSync("./input.txt", "utf8");
// parse input
const lines = input.split("\n");

let pwd = "/";
let fileTree = new Map();
for (let line of lines) {
  let commandParts = line.split(" ");

  let folder = fileTree.get(pwd);
  if (!folder) {
    fileTree.set(pwd, { subFolders: [], files: new Map() });
    folder = fileTree.get(pwd);
  }

  if (commandParts[0] === "$") {
    let cmd = parseCommand(commandParts, pwd);
    if (cmd.command === "cd") {
      pwd = cmd.pwd;
    }
  } else {
    let [type, name] = commandParts;
    if (type === "dir") {
      folder.subFolders.push(name);
    } else {
      folder.files.set(name, Number(type));
    }
  }
}
calculateSizesOfFoldersinFileTree(fileTree);
calculateSizeOfFolderWithSubFolders(fileTree, "/");

let sizeOfFoldersWithSizeLessThan100000 = 0;
for (let [key, value] of fileTree) {
  if (value.totalSize <= 100000) {
    sizeOfFoldersWithSizeLessThan100000 += value.totalSize;
  }
}
console.log("part 1 answer", sizeOfFoldersWithSizeLessThan100000);

function parseCommand(commandParts, pwd) {
  let [dollarSign, command, ...args] = commandParts;
  if (command === "cd") {
    let [dir] = args;
    if (dir === "..") {
      pwd = pwd.slice(0, pwd.lastIndexOf("/"));
    } else if (dir === "/") {
      pwd = "/";
    } else {
      pwd = pwd === "/" ? pwd + dir : pwd + "/" + dir;
    }
    if (pwd === "" || pwd === "//") {
      pwd = "/";
    }
    return {
      pwd,
      command: "cd",
    };
  }

  if (command === "ls") {
    let [dir] = args;
    return {
      pwd,
      command: "ls",
    };
  }
}

function calculateSizesOfFoldersinFileTree(fileTree) {
  for (let [key, value] of fileTree) {
    let size = 0;
    for (let [file, fileSize] of value.files) {
      size += fileSize;
    }
    fileTree.get(key).directFilesSize = size;
  }
}

function calculateSizeOfFolderWithSubFolders(fileTree, pwd) {
  //   console.log(pwd);
  let folder = fileTree.get(pwd);
  let size = folder.directFilesSize;
  for (let subFolder of folder.subFolders) {
    size += calculateSizeOfFolderWithSubFolders(
      fileTree,
      pwd === "/" ? pwd + subFolder : pwd + "/" + subFolder
    );
  }
  fileTree.get(pwd).totalSize = size;
  return size;
}

function printFileTree(fileTree, pwd) {
  let folder = fileTree.get(pwd);
  let folderName = pwd.slice(pwd.lastIndexOf("/") + 1);

  let depth = (pwd.match(/\//g) || []).length;
  let offset = " ".repeat(depth * 2);

  if (pwd === "/") {
    offset = "";
    folderName = "/";
  }
  console.log(`${offset}+ ${folderName} ${folder.totalSize}`);

  for (let [file, fileSize] of folder.files) {
    console.log(offset, " |-", file, fileSize);
  }
  for (let subFolder of folder.subFolders) {
    printFileTree(
      fileTree,
      pwd === "/" ? pwd + subFolder : pwd + "/" + subFolder
    );
  }
}

printFileTree(fileTree, "/");
let totalDiskSize = 70000000;
let spaceLeft = totalDiskSize - fileTree.get("/").totalSize;
let minRequiredSpace = 30000000;

let delta = minRequiredSpace - spaceLeft;

// folder with size bigger than delta
let folderWithSizeBiggerThanDelta = [];
for (let [key, value] of fileTree) {
  if (value.totalSize > delta) {
    folderWithSizeBiggerThanDelta.push({ key, value });
  }
}
let result = folderWithSizeBiggerThanDelta.sort(
  (a, b) => b.value.totalSize - a.value.totalSize
);

console.log("Part 2 answer", result[result.length - 1].value.totalSize);
