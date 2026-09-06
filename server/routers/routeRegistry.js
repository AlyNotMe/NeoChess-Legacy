class RouteRegistry {
  constructor() {}

  /**
   * @param {string} path
   * @param {import("express").RequestHandler} handler
   * @returns {function(): [string, import("express").RequestHandler]}
   */
  route(path, handler) {
    // Only catches rejected promises from async handlers. Synchronous
    // throws are already caught and forwarded to next() by Express itself.
    const safeHandler = (req, res, next) => {
      Promise.resolve(handler(req, res, next)).catch(next);
    };
    return () => {
      return [path, safeHandler];
    };
  }
}

module.exports = RouteRegistry;
