/*************************************************************
 *
 * New express app
 *
 *************************************************************/

const express = require("express");
globalThis.Console = require("./console.js");
globalThis.app = express();

/*************************************************************
 *
 * Import configuration
 *
 *************************************************************/

// Load global configuration (environment variables, app name, port, etc.)
globalThis.config = require("./config.js");

// Apply Express configuration (views, CORS, compression, sessions, etc.)
require("./configuration.js");

/*************************************************************
 *
 * Run App
 *
 *************************************************************/

// Load global middlewares (error handlers, shared utilities, etc.)
require("./middlewares/index.js");

// Load routes (authentication, home, etc.)
require("./routers/index.js");

const https = require("https");
const fs = require("fs");

const options = {
  key: fs.readFileSync("ssl/key.pem"),
  cert: fs.readFileSync("ssl/cert.pem"),
};

const server = https
  .createServer(options, app)
  .listen(config.port, config.url, () => {
    /*************************************************************
     *
     * Clear console
     *
     *************************************************************/

    Console.load();
  });

/*************************************************************
 *
 * Socket runner
 *
 *************************************************************/
const runner = require("./service/socket.io/server.js");
runner(server);
