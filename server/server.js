/*************************************************************
 *
 * New express app
 *
 *************************************************************/

const express = require("express");
const Console = require("./console.js");
const app = express();

/*************************************************************
 *
 * Import configuration
 *
 *************************************************************/

// Load global configuration (environment variables, app name, port, etc.)
const config = require("./config.js");

// Apply Express configuration (views, CORS, compression, sessions, etc.)
const sessionMiddleware = require("./configuration.js")(app);

/*************************************************************
 *
 * Run App
 *
 *************************************************************/

// Load global middlewares (error handlers, shared utilities, etc.)
require("./middlewares/index.js")(app);

// Load routes (authentication, home, etc.)
require("./routers/index.js")(app);

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
runner(server, sessionMiddleware);
