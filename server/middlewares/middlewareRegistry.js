class MiddlewareRegistry {
  constructor(path = "/") {
    this.path = path;
  }

  /**
   * @param {import("express").RequestHandler} handler
   * @returns {function(): [string, import("express").RequestHandler]}
   */
  middleware(handler) {
    return () => {
      return [this.path, handler];
    };
  }
}

module.exports = MiddlewareRegistry;
