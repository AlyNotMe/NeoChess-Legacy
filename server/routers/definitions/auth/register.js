/*************************************************************
 *
 * Auth/register router
 *
 *************************************************************/

const Route = require("../../routeRegistry.js");
const route = new Route();
const validator = require("../../../service/validator.js");

const get = route.route("/:language?/register", (req, res) => {
  /*************************************************************
   *
   * Init session and translation
   *
   *************************************************************/

  const defaultSession = { username: [], password: [] };
  if (!req.session.errors) req.session.errors = defaultSession;
  const translate = req.load("auth/register", "register");
  const langName = req.params.language || req.config.default_language;

  if (translate) {
    res.render("auth/register", {
      translate,
      langName,
      h: req.helper,
      old: req.session.old,
      errors: req.session.errors,
    });
  }
});

const post = route.route("/:language?/register", async (req, res) => {
  /*************************************************************
   *
   * Init some variable
   *
   *************************************************************/

  const { User } = require("../../../service/database/index.js");
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
    res.redirect(`/${langName}/register`);
    return;
  }

  /*************************************************************
   *
   * Create user if don't exist
   *
   *************************************************************/

  const [user, created] = await User.findOrCreate({
    where: { username },
    defaults: { username, password },
  });

  if (created) {
    res.redirect(`/${langName}/login`);
    return;
  }

  const code = "alreadyExist";
  const msgError = require("../../../langue/errors.js")[langName].ORM[code];
  req.session.errors.username = [msgError];
  console.log(req.session);
  res.redirect(`/${langName}/register`);
});

module.exports = { get, post };
