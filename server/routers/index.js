const Router = require("./routerHandler.js");

module.exports = (app) => {
  const router = new Router(app);

  router.route("home", ["auth"]);
  router.route("auth/register");
  router.route("auth/login");

  router.route("chess/create", ["auth"]);
  router.route("chess/game", ["auth"]);
};
