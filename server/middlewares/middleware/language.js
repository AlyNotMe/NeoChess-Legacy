/*************************************************************
 *
 * Middleware Language
 *
 * -----------------------------------
 * Get the current translation
 * -----------------------------------
 *
 *************************************************************/

const Middleware = require("../middlewareRegistry.js");

module.exports = new Middleware().middleware((req, res, next) => {
  function load(name, redirectPath) {
    const translate = require(`../../langue/${name}.js`);
    const language = req.params.language;
    let result;

    if (language) {
      result = translate[language];
    } else {
      result = translate[req.config.default_language];
    }

    if (!result) {
      res.redirect(`/${req.config.default_language}/${redirectPath}`);
    }

    return result;
  }

  req.load = load;
  next();
});
