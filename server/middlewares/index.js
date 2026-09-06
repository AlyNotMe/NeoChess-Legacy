const MiddlewareHandler = require("./middlewareHandler.js");

/*************************************************************
 *
 * Add Middleware
 *
 *************************************************************/
module.exports = (app) => {
  MiddlewareHandler.register("config");
  MiddlewareHandler.register("logger");
  MiddlewareHandler.register("language");
  MiddlewareHandler.register("helper");

  /*************************************************************
   *
   * Run all global Middleware
   *
   * -------------------------
   * Do not delete this code |
   * -------------------------
   *
   *************************************************************/

  MiddlewareHandler.run(app);
};
