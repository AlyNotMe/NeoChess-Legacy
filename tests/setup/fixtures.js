/*************************************************************
 *
 * Test fixtures
 *
 *************************************************************/

const { hashPassword } = require("../../server/service/auth/password.js");
const { User, Game, Gamemode } = require("../../server/service/database/index.js");

/**
 * Creates a user directly in DB (bypassing the /register route),
 * for tests that need an already-existing account (e.g. login,
 * duplicate-username on register, authenticated game access).
 * @param {{ username?: string, password?: string }} [overrides]
 * @returns {Promise<{ user: import("sequelize").Model, plainPassword: string }>}
 */
async function createTestUser(overrides = {}) {
  // Kept under the 20-char max enforced by the register route's validator,
  // even though this fixture bypasses it, so fixture usernames stay
  // realistic and interchangeable with ones the app would actually accept.
  const username = overrides.username || `p${Date.now().toString().slice(-8)}${Math.random().toString(36).slice(2, 5)}`;
  const plainPassword = overrides.password || "correcthorse";

  const user = await User.create({
    username,
    password: await hashPassword(plainPassword),
  });

  return { user, plainPassword };
}

/**
 * Creates a game directly in DB, resolving the "chess" gamemode
 * seeded via `db:seed:all` (the FK is required, and the app only
 * ever creates games under this one mode for now).
 * @returns {Promise<import("sequelize").Model>}
 */
async function createTestGame() {
  const chessMode = await Gamemode.findOne({ where: { libelle: "chess" } });
  return Game.create({ gamemode: chessMode.id });
}

module.exports = { createTestUser, createTestGame };
