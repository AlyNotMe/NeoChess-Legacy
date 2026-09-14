"use strict";

const { hashPassword } = require("../../auth/password.js");

/*************************************************************
 *
 * Dashboard dev seed
 *
 * -----------------------------------
 * Dev-only convenience data so the dashboard (elo history,
 * leaderboard, recent games) has something real to query instead of
 * the placeholder in mockDashboardData.js. Creates a handful of bot
 * opponents plus, for every real user already registered at seed
 * time, a batch of games/elo history against those bots.
 *
 * Not meant for production or test DBs — run manually:
 *   npx sequelize-cli db:seed --seed 20260906120000-dashboard-dev-seed.js
 * -----------------------------------
 *
 *************************************************************/

const BOTS = [
  { username: "Magnus_C", elo: 2847 },
  { username: "Hikaru_N", elo: 2792 },
  { username: "Fabiano_C", elo: 2776 },
  { username: "AlphaZero7", elo: 1198 },
  { username: "KnightRider_42", elo: 1150 },
  { username: "PawnStorm_99", elo: 1080 },
  { username: "BishopBoss", elo: 1210 },
];

const DEV_PASSWORD = "password123";

/** @param {import('sequelize-cli').QueryInterface} queryInterface */
async function insertUser(queryInterface, username, xp) {
  const [insertId] = await queryInterface.sequelize.query(
    "INSERT INTO `user` (username, password, xp, createdAt, updatedAt) VALUES (:username, :password, :xp, NOW(), NOW())",
    { replacements: { username, password: await hashPassword(DEV_PASSWORD), xp } },
  );
  return insertId;
}

/** @param {import('sequelize-cli').QueryInterface} queryInterface */
async function insertGame(queryInterface, gamemodeId, monthsAgo) {
  const [insertId] = await queryInterface.sequelize.query(
    "INSERT INTO `game` (gamemode, createdAt, updatedAt) VALUES (:gamemodeId, DATE_SUB(NOW(), INTERVAL :monthsAgo MONTH), DATE_SUB(NOW(), INTERVAL :monthsAgo MONTH))",
    { replacements: { gamemodeId, monthsAgo } },
  );
  return insertId;
}

async function insertGameUser(queryInterface, idGame, idUser, color) {
  await queryInterface.sequelize.query(
    "INSERT INTO `game_user` (color, id_game, id_user) VALUES (:color, :idGame, :idUser)",
    { replacements: { color, idGame, idUser } },
  );
}

async function insertElo(queryInterface, idUser, idGame, elo, monthsAgo) {
  await queryInterface.sequelize.query(
    "INSERT INTO `elo` (elo, id_user, id_game, createdAt, updatedAt) VALUES (:elo, :idUser, :idGame, DATE_SUB(NOW(), INTERVAL :monthsAgo MONTH), DATE_SUB(NOW(), INTERVAL :monthsAgo MONTH))",
    { replacements: { elo, idUser, idGame, monthsAgo } },
  );
}

async function insertState(queryInterface, idGame, idUser, move) {
  await queryInterface.sequelize.query(
    "INSERT INTO `state` (move, id_game, id_user) VALUES (:move, :idGame, :idUser)",
    { replacements: { move, idGame, idUser } },
  );
}

// Scholar's mate, as plain "from+to" square pairs (no captures/check
// notation — the dashboard board replay just moves a piece from one
// square to the other). Alternates white/black, starting with white.
const SAMPLE_GAME_MOVES = ["e2e4", "e7e5", "f1c4", "b8c6", "d1h5", "g8f6", "h5f7"];

module.exports = {
  async up(queryInterface) {
    // 1. Bot opponents (also fill out the leaderboard)
    const botIds = [];
    for (const bot of BOTS) {
      const id = await insertUser(queryInterface, bot.username, 0);
      botIds.push({ id, ...bot });
      await insertElo(queryInterface, id, null, bot.elo, 0);
    }

    const [[gamemode]] = await queryInterface.sequelize.query(
      "SELECT id FROM `gamemode` WHERE libelle = 'chess' LIMIT 1",
    );
    if (!gamemode) {
      throw new Error(
        "No 'chess' gamemode found — run the default-gamemode seeder first.",
      );
    }

    // 2. Games/elo history for every real (non-bot) user already registered
    const botUsernames = BOTS.map((bot) => bot.username);
    const [realUsers] = await queryInterface.sequelize.query(
      "SELECT id, username FROM `user` WHERE username NOT IN (:botUsernames)",
      { replacements: { botUsernames } },
    );

    for (const user of realUsers) {
      let elo = 1000;
      // 7 monthly elo checkpoints ending "now", trending upward
      for (let monthsAgo = 6; monthsAgo >= 0; monthsAgo--) {
        const opponent = botIds[Math.floor(Math.random() * botIds.length)];
        const gameId = await insertGame(queryInterface, gamemode.id, monthsAgo);
        const userColor = Math.random() < 0.5 ? "white" : "black";
        await insertGameUser(queryInterface, gameId, user.id, userColor);
        await insertGameUser(
          queryInterface,
          gameId,
          opponent.id,
          userColor === "white" ? "black" : "white",
        );

        const delta = Math.round((Math.random() - 0.35) * 40); // slight upward bias
        elo += delta;
        await insertElo(queryInterface, user.id, gameId, elo, monthsAgo);

        // Give the most recent game an actual move history, so the
        // dashboard's "last game" board has a real position to render
        // instead of the starting position.
        if (monthsAgo === 0) {
          const whiteId = userColor === "white" ? user.id : opponent.id;
          const blackId = userColor === "white" ? opponent.id : user.id;
          for (const [index, move] of SAMPLE_GAME_MOVES.entries()) {
            const moverId = index % 2 === 0 ? whiteId : blackId;
            await insertState(queryInterface, gameId, moverId, move);
          }
        }
      }
    }
  },

  async down(queryInterface) {
    // Some FKs in this schema aren't actually enforced as ON DELETE
    // CASCADE in MySQL despite the migration options (Sequelize's
    // addColumn({ references }) doesn't always create the clause) —
    // delete children before parents instead of relying on cascade.
    const botUsernames = BOTS.map((bot) => bot.username);
    const [bots] = await queryInterface.sequelize.query(
      "SELECT id FROM `user` WHERE username IN (:botUsernames)",
      { replacements: { botUsernames } },
    );
    const botIds = bots.map((bot) => bot.id);
    if (botIds.length) {
      await queryInterface.sequelize.query("DELETE FROM `elo` WHERE id_user IN (:botIds)", {
        replacements: { botIds },
      });
      await queryInterface.sequelize.query("DELETE FROM `game_user` WHERE id_user IN (:botIds)", {
        replacements: { botIds },
      });
      await queryInterface.sequelize.query("DELETE FROM `state` WHERE id_user IN (:botIds)", {
        replacements: { botIds },
      });
      await queryInterface.bulkDelete("user", { username: botUsernames });
    }

    // Best-effort only for real users: seeded games/elo mixed with any
    // real activity can't be told apart after the fact. For a full
    // reset in dev, recreate the DB (e.g. `docker compose down -v`).
  },
};
