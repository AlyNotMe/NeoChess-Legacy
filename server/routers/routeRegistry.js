class RouteRegistry {
  constructor() {}

  /**
   * @param {string} path
   * @param {import("express").RequestHandler} handler
   * @returns {function(): [string, import("express").RequestHandler]}
   */
  route(path, handler) {
    return () => {
      return [path, handler];
    };
  }
}

module.exports = RouteRegistry;
