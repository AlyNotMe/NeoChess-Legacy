class MiddlewareRegistry {
  constructor(path = "/") {
    this.path = path;
  }

  /**
   * @param {import("express").RequestHandler} handler
   * @returns {function(): [string, import("express").RequestHandler]}
   */
  middleware(handler) {
    // Only catches rejected promises from async handlers. Synchronous
    // throws are already caught and forwarded to next() by Express itself.
    const safeHandler = (req, res, next) => {
      Promise.resolve(handler(req, res, next)).catch(next);
    };
    return () => {
      return [this.path, safeHandler];
    };
  }
}

module.exports = MiddlewareRegistry;
