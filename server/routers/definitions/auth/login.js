/*************************************************************
 *
 * Auth/login router
 *
 *************************************************************/

const Route = require("../../routeRegistry.js");
const route = new Route();
const validator = require("../../../service/validator.js");

/**
 * Builds the object stored in req.session.user on login.
 * @param {import("sequelize").Model} user
 */
function buildSessionUser(user) {
  return {
    username: user.dataValues.username,
    id: user.dataValues.id,
    createdAt: user.dataValues.createdAt,
  };
}
/** @typedef {ReturnType<typeof buildSessionUser>} SessionUser */

const get = route.route("/:language?/login", (req, res) => {
  const translate = req.load("auth/login", "login");
  const langName = req.params.language;

  if (translate) {
    res.render("auth/login", {
      translate,
      langName,
      h: req.helper,
      old: req.session.old,
      errors: req.session.errors,
    });
  }
});

const post = route.route("/:language?/login", async (req, res) => {
  const { username, password } = req.body;
  const langName = req.params.language || req.config.default_language;

  /*************************************************************
   *
   * Validator check
   *
   *************************************************************/

  req.session.errors = {};
  req.session.old = { username, password };
  const usernameErrors = new validator(username, "username", {
    isAlphanumeric: true,
    min: 3,
    max: 20,
  }).validate();
  const passwordErrors = new validator(password, "password", {
    isAlphanumeric: true,
    min: 6,
    max: 40,
  }).validate();
  const errorMessages = require("../../../langue/errors.js")[langName].ORM;
  if (usernameErrors.length) {
    req.session.errors.username = Object.fromEntries(
      usernameErrors.map((rule) => [rule, errorMessages[rule]]),
    );
  }
  if (passwordErrors.length) {
    req.session.errors.password = Object.fromEntries(
      passwordErrors.map((rule) => [rule, errorMessages[rule]]),
    );
  }
  if (usernameErrors.length || passwordErrors.length) {
    res.redirect(`/${langName}/login`);
    return;
  }

  /*************************************************************
   *
   * Authenticate user
   *
   *************************************************************/

  const authenticateUser = require("../../../service/auth/authenticateUser.js");
  const user = await authenticateUser(username, password);

  if (user) {
    req.session.user = buildSessionUser(user);
    res.redirect("/");
  } else {
    const code = "notExist";
    const msgError = require("../../../langue/errors.js")[langName].ORM[code];
    req.session.errors = { msgError };
    req.session.old = { username, password };
    res.redirect(`/${langName}/login`);
  }
});

module.exports = { get, post };
