const { User } = require("../database/index.js");
const { comparePassword } = require("./password.js");

/**
 * Authentifie un utilisateur par identifiants exacts.
 * @param {string} username
 * @param {string} password
 * @returns {Promise<import("sequelize").Model|null>} l'utilisateur trouvé, ou null si les identifiants sont invalides.
 */
async function authenticateUser(username, password) {
  const user = await User.findOne({ where: { username } });
  if (!user) return null;
  const isValid = await comparePassword(password, user.password);
  return (isValid && user) || null;
}

module.exports = authenticateUser;
