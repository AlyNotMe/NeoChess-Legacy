/*************************************************************
 *
 * Auth/login router
 *
 *************************************************************/

const Route = require("../../route.js");
const route = new Route();
const validator = require("../../../service/validator.js");

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

const post = route.route("/:lanuage?/login", async (req, res) => {
  const { username, password } = req.body;
  const langName = req.params.language || config.default_language;

  /*************************************************************
   *
   * Validator check
   *
   *************************************************************/

  req.session.errors = {};
  req.session.old = { username, password };
  const errorUsername = new validator(username, "username", {
    isAlphanumeric: true,
    min: 3,
    max: 20,
  }).validate(req.session, langName);
  const errorPassword = new validator(password, "password", {
    isAlphanumeric: true,
    min: 6,
    max: 40,
  }).validate(req.session, langName);
  const error = errorUsername || errorPassword;
  if (error) {
    res.redirect(`/${langName}/register`);
    return;
  }

  /*************************************************************
   *
   * Authenticate user
   *
   *************************************************************/

  const { sequelize } = require("../../../service/database/models/");
  const User = sequelize.models.user;
  const user = await User.findOne({
    where: {
      username,
      password,
    },
  });

  if (user) {
    req.session.user = {
      username: user.dataValues.username,
      id: user.dataValues.id,
      createdAt: user.dataValues.createdAt,
    };
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
