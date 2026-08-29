const { User } = require("../database/index.js");

/**
 * Authentifie un utilisateur par identifiants exacts.
 * @param {string} username
 * @param {string} password
 * @returns {Promise<import("sequelize").Model|null>} l'utilisateur trouvé, ou null si les identifiants sont invalides.
 */
async function authenticateUser(username, password) {
  return User.findOne({ where: { username, password } });
}

module.exports = authenticateUser;
