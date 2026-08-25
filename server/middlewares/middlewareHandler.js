/*************************************************************
 *
 * Middleware class
 *
 * -----------------------------------------------------------
 * This class
 *
 *************************************************************/

class MiddlewareHandler {
  static globalMiddlewares = [];
  constructor() {
    this.middleware = [];
  }

  /**
   * @param {string} path
   */
  static register(path) {
    const definition = require(`./middleware/${path}.js`);
    MiddlewareHandler.globalMiddlewares.push(definition);
  }

  /**
   * @param {string} path
   */
  add(path) {
    const definition = require(`./middleware/${path}.js`);
    this.middleware.push(definition()[1]);
  }

  /*************************************************************
   *
   * Register global Middleware
   *
   *************************************************************/
  static run(app) {
    for (const middleware of MiddlewareHandler.globalMiddlewares) {
      const [path, handler] = middleware();
      app.use(path, handler);
    }
  }
}

module.exports = MiddlewareHandler;
