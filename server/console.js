const fs = require("fs");
require("colors");

const loading = async (path) => {
  const date = new Date();

  // Extraction des composants de la date
  const annee = date.getFullYear();
  const mois = String(date.getMonth() + 1).padStart(2, "0"); // Ajout du zéro devant si nécessaire
  const jour = String(date.getDate()).padStart(2, "0"); // Ajout du zéro devant si nécessaire
  const heure = String(date.getHours()).padStart(2, "0"); // Ajout du zéro devant si nécessaire
  const minute = String(date.getMinutes()).padStart(2, "0"); // Ajout du zéro devant si nécessaire
  const seconde = String(date.getSeconds()).padStart(2, "0");

  // Création de la chaîne de caractères formatée
  const sortie = `[${annee} ${mois} ${jour} - ${heure}:${minute}:${seconde}]`
    .green;
  const message = `Server started`.red;
  const msg = `${sortie} ${message}`;
  console.log(msg);

  await loadFiles(path);
  console.log("\n");
};

const loadFiles = async (path) => {
  return new Promise((resolve, reject) => {
    fs.readdir(path, (err, files) => {
      if (err) {
        console.log("Erreur lors de la lecture du répertoire :", err);
        return;
      }

      files.forEach((file) => {
        fs.stat(`${path}/${file}`, (err, stats) => {
          if (err) {
            console.error(
              "Erreur lors de la récupération des informations sur le fichier :",
              err
            );
            return;
          }

          if (stats.isDirectory()) {
            loadFiles(`${path}/${file}`);
          } else {
            const date = new Date();

            // Extraction des composants de la date
            const annee = date.getFullYear();
            const mois = String(date.getMonth() + 1).padStart(2, "0"); // Ajout du zéro devant si nécessaire
            const jour = String(date.getDate()).padStart(2, "0"); // Ajout du zéro devant si nécessaire
            const heure = String(date.getHours()).padStart(2, "0"); // Ajout du zéro devant si nécessaire
            const minute = String(date.getMinutes()).padStart(2, "0"); // Ajout du zéro devant si nécessaire
            const seconde = String(date.getSeconds()).padStart(2, "0");

            // Création de la chaîne de caractères formatée
            const sortie =
              `[${annee} ${mois} ${jour} - ${heure}:${minute}:${seconde}]`
                .green;
            const message = `${path}/${file} loaded with success`.red;
            const msg = `${sortie} ${message}`;
            console.log(msg);
          }
        });
      });
    });

    setTimeout(resolve, 1 * 1000);
  });
};

async function load() {
  console.clear();
  await loading("./server");

  console.log(
    `/*
|-------------------------------------------------------------------------------------------|
| ${config.name.yellow} -- ${
      config.version.green
    } // Server run at current url : ${
      `https://${config.url}:${config.port}`.blue
    }             |
| ${
      "Author Enzoo_Kms".red
    }                                                                          |
|-------------------------------------------------------------------------------------------|
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
    this.output += `|`;
    for (let i = 0; i < this.size; i++) {
      this.output += "-";
    }
    this.output += `|\n| ${this.name.green}`;
    if (this.name.length > this.size)
      throw new Error("name of event is to long");

    for (let i = 0; i < this.size - 1 - this.name.length; i++) {
      this.output += " ";
    }
    this.output += `|\n| `;

    const currentDate = new Date();
    const date =
      `[ ${currentDate.getDate()}/${15}/${currentDate.getUTCFullYear()} ${this.#format(
        currentDate.getHours()
      )}:${this.#format(currentDate.getMinutes())}:${this.#format(
        currentDate.getSeconds()
      )} ]`.magenta;
    this.output += date;
    for (let i = 0; i < this.size + 9 - date.length; i++) {
      this.output += " ";
    }
    this.output += `|\n|`;
    for (let i = 0; i < this.size; i++) {
      this.output += "-";
    }
    this.output += "|";
  }

  insertLine(name, value) {
    this.output += "\n| ";
    this.output += `${name} : ${value}`;

    const max = this.size - name.length - value.length - 4;
    for (let i = 0; i < max; i++) {
      this.output += " ";
    }

    this.output += "|";
    return this;
  }

  run() {
    this.output += "\n|";
    for (let i = 0; i < this.size; i++) {
      this.output += "-";
    }
    this.output += "|\n";

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
