/*************************************************************
 *
 * Middleware Helper
 *
 * -----------------------------------
 * Implement Helper for client
 * -----------------------------------
 *
 *************************************************************/

const Middleware = require("../middlewareRegistry.js");

module.exports = new Middleware().middleware((req, res, next) => {
  const helper = require("../../helper.js");
  req.helper = helper;
  next();
});
