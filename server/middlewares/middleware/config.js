/*************************************************************
 *
 * Middleware Config
 *
 * -----------------------------------
 * Attache la config globale à req
 * -----------------------------------
 *
 *************************************************************/

const Middleware = require("../middlewareRegistry.js");
const config = require("../../config.js");

module.exports = new Middleware().middleware((req, res, next) => {
  req.config = config;
  next();
});