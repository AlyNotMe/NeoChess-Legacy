const { User } = require("../database/index.js");

/**
 * Crée un utilisateur s'il n'existe pas déjà.
 * @param {string} username
 * @param {string} password
 * @returns {Promise<[import("sequelize").Model, boolean]>} [l'utilisateur, true s'il vient d'être créé]
 */
async function registerUser(username, password) {
  return User.findOrCreate({ where: { username }, defaults: { username, password } });
}

module.exports = registerUser;
