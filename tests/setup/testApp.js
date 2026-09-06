/*************************************************************
 *
 * Test app factory
 *
 * -----------------------------------
 * Builds the same Express app as server.js (views, middlewares,
 * routes), minus the HTTPS listener — Supertest talks to the
 * app object directly over an in-memory connection.
 * -----------------------------------
 *
 *************************************************************/

function buildTestApp() {
  const express = require("express");
  const app = express();

  require("../../server/configuration.js")(app);
  require("../../server/middlewares/index.js")(app);
  require("../../server/routers/index.js")(app);

  return app;
}

module.exports = buildTestApp;
