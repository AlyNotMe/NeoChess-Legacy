const MiddlewareHandler = require("../middlewares/middlewareHandler.js");

class RouterHandler {
  constructor() {
    this.app = app;
  }

  /**
   * @param {string} routeName
   * @param {...(string|string[])} middlewares
   */

  route(routeName, ...middlewares) {
    /*************************************************************
     *
     * router variable
     *
     * ----------------------------------------------------------
     * Router is object of verbs http return 2 args
     * First args is the url path exemple "/users"
     * The last one is the express handler (req, res)
     * ----------------------------------------------------------
     *
     *************************************************************/
    const router = require(`./definitions/${routeName}.js`);
    const middlewareInstance = new MiddlewareHandler();

    for (const middlewareName of middlewares.flat()) {
      middlewareInstance.add(middlewareName);
    }

    for (const method in router) {
      const [path, handler] = router[method]();
      const middlewares = middlewareInstance.middleware;
      app[method](path, ...middlewares, handler);
    }
  }
}

module.exports = RouterHandler;
