const fs = require("fs");
require("colors");

function formatDate(date = new Date()) {
  const y = date.getFullYear();
  const mo = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  const h = String(date.getHours()).padStart(2, "0");
  const mi = String(date.getMinutes()).padStart(2, "0");
  const s = String(date.getSeconds()).padStart(2, "0");
  return `[${y} ${mo} ${d} - ${h}:${mi}:${s}]`;
}

const loading = async (path) => {
  console.log(`${formatDate().green} ${"Server started".red}`);
  await loadFiles(path);
  console.log("\n");
};

const loadFiles = async (dirPath) => {
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = `${dirPath}/${entry.name}`;

    if (entry.isDirectory()) {
      await loadFiles(fullPath);
    } else {
      console.log(`${formatDate().green} ${`${fullPath} loaded with success`.red}`);
    }
  }
};

async function load() {
  console.clear();
  await loading("./server");

  const url = `https://${config.url}:${config.port}`;
  const line1 = `${config.name} -- ${config.version} // Server run at current url : ${url}`;
  const line2 = `Author Enzoo_Kms`;
  const width = Math.max(line1.length, line2.length) + 2;
  const border = "-".repeat(width);

  const colored1 = `${config.name.yellow} -- ${config.version.green} // Server run at current url : ${url.blue}`;
  const colored2 = `${"Author Enzoo_Kms".red}`;

  console.log(
    `/*
|${border}|
| ${colored1}${" ".repeat(width - 1 - line1.length)}|
| ${colored2}${" ".repeat(width - 1 - line2.length)}|
|${border}|
*/\n`
  );
}

class Event {
  constructor(Name, size = 60) {
    this.name = Name;
    this.size = size;
    this.output = "";

    this.#header();
  }

  #header() {
    const line = "-".repeat(this.size);
    if (this.name.length > this.size)
      throw new Error("name of event is too long");

    this.output += `|${line}|\n`;
    this.output += `| ${this.name.green}${" ".repeat(this.size - 1 - this.name.length)}|\n`;

    const date = new Date();
    const dateStr = `[ ${String(date.getDate()).padStart(2, "0")}/${String(date.getMonth() + 1).padStart(2, "0")}/${date.getUTCFullYear()} ${this.#format(date.getHours())}:${this.#format(date.getMinutes())}:${this.#format(date.getSeconds())} ]`;
    const dateColored = dateStr.magenta;
    this.output += `| ${dateColored}${" ".repeat(this.size - 1 - dateStr.length)}|\n`;
    this.output += `|${line}|`;
  }

  insertLine(name, value) {
    const content = `${name} : ${value}`;
    const padding = Math.max(0, this.size - 2 - content.length);
    this.output += `\n| ${content}${" ".repeat(padding)}|`;
    return this;
  }

  run() {
    const line = "-".repeat(this.size);
    this.output += `\n|${line}|\n`;
    console.log(this.output);
  }

  #format(n) {
    if (n < 10) {
      return `0${n}`;
    }
    return n;
  }
}

module.exports = { load, Event };
