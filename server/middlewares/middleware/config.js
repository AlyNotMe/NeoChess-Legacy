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

module.exports = new Middleware().middleware((req, res, next) => {
  req.config = config;
  next();
});