/*************************************************************
 *
 * Middleware Auth
 *
 * -----------------------------------
 * Implement Auth verification
 * -----------------------------------
 *
 *************************************************************/

const Middleware = require("../middlewareRegistry.js");

module.exports = new Middleware().middleware(async (req, res, next) => {
  const langName = req.params.language || req.config.default_language;
  if (!req.session.user) {
    res.redirect(`/${langName}/register`);
    return;
  }
  
  const { User } = require("../../service/database/index.js");
  const user = await User.findByPk(req.session.user.id);
  if (!user) {
    req.session.destroy(() => {
      res.redirect(`/${langName}/register`);
    });
    return;
  }
  req.session.user.xp = user.xp;

  next();
});
