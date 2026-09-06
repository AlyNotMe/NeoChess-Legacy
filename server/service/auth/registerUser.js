const { User } = require("../database/index.js");
const { hashPassword } = require("./password.js");

/**
 * Crée un utilisateur s'il n'existe pas déjà.
 * @param {string} username
 * @param {string} password
 * @returns {Promise<[import("sequelize").Model, boolean]>} [l'utilisateur, true s'il vient d'être créé]
 */
async function registerUser(username, password) {
  const hashedPassword = await hashPassword(password);
  return User.findOrCreate({
    where: { username },
    defaults: { username, password: hashedPassword },
  });
}

module.exports = registerUser;
