const { sequelize } = require("../database/index.js");
const Chessboard = require("../chess/gameState.js");

/*************************************************************
 *
 * Dashboard service
 *
 * -----------------------------------
 * Real queries backing the home dashboard, replacing the former
 * mockDashboardData.js placeholder. `elo` is a history table (see
 * migration 20260829014540) with one row per rating change, optionally
 * tied to a game via id_game — every "result" below (win/loss/draw)
 * is derived from the sign of the elo delta between consecutive rows
 * for a user, since neither `game` nor `game_user` store an explicit
 * winner/outcome.
 *
 * This service only returns data and computed values (numbers,
 * booleans, classifications like "win"/"loss"/"draw") — it never
 * builds display text. Formatting dates in French, adding a "+" sign,
 * or turning a result code into a translated label is Pug's job.
 * -----------------------------------
 *
 *************************************************************/

/**
 * Latest elo value for a user, or the starting 1000 if they have no
 * history yet.
 * @param {number} userId
 */
async function getCurrentElo(userId) {
  const [[row]] = await sequelize.query(
    "SELECT elo FROM `elo` WHERE id_user = :userId ORDER BY createdAt DESC LIMIT 1",
    { replacements: { userId } },
  );
  return row ? row.elo : 1000;
}

/**
 * Sum of elo deltas over the last 30 days, for the "+X ce mois" badge.
 * @param {number} userId
 */
async function getEloDeltaThisMonth(userId) {
  const [rows] = await sequelize.query(
    `SELECT elo,
            LAG(elo) OVER (ORDER BY createdAt) AS prevElo,
            createdAt
     FROM \`elo\`
     WHERE id_user = :userId
     ORDER BY createdAt ASC`,
    { replacements: { userId } },
  );
  const oneMonthAgo = new Date();
  oneMonthAgo.setDate(oneMonthAgo.getDate() - 30);

  return rows
    .filter((row) => row.prevElo !== null && new Date(row.createdAt) >= oneMonthAgo)
    .reduce((total, row) => total + (row.elo - row.prevElo), 0);
}

/**
 * Elo history for the sparkline, oldest first.
 * @param {number} userId
 * @param {number} [limit]
 */
async function getEloHistory(userId, limit = 7) {
  const [rows] = await sequelize.query(
    `SELECT elo, createdAt FROM (
       SELECT elo, createdAt FROM \`elo\` WHERE id_user = :userId ORDER BY createdAt DESC LIMIT :limit
     ) recent ORDER BY createdAt ASC`,
    { replacements: { userId, limit } },
  );
  return rows.map((row) => ({
    elo: row.elo,
    createdAt: row.createdAt,
  }));
}

/**
 * Top N by current elo, always including the requesting user even if
 * they fall outside that top N (their real rank is still reported).
 * @param {number} userId
 * @param {number} [limit]
 */
async function getLeaderboard(userId, limit = 5) {
  const [rows] = await sequelize.query(
    `WITH elo_ordered AS (
       SELECT id_user, id_game, elo, createdAt,
              LAG(elo) OVER (PARTITION BY id_user ORDER BY createdAt) AS prevElo
       FROM \`elo\`
     ),
     game_results AS (
       SELECT id_user,
              COUNT(*) AS games,
              SUM(CASE WHEN elo > prevElo THEN 1 ELSE 0 END) AS wins
       FROM elo_ordered
       WHERE id_game IS NOT NULL AND prevElo IS NOT NULL
       GROUP BY id_user
     ),
     latest_elo AS (
       SELECT id_user, elo,
              ROW_NUMBER() OVER (PARTITION BY id_user ORDER BY createdAt DESC) AS rn
       FROM \`elo\`
     ),
     ranked AS (
       SELECT u.id, u.username, le.elo,
              RANK() OVER (ORDER BY le.elo DESC) AS \`rank\`,
              COALESCE(gr.games, 0) AS games,
              COALESCE(gr.wins, 0) AS wins
       FROM \`user\` u
       JOIN latest_elo le ON le.id_user = u.id AND le.rn = 1
       LEFT JOIN game_results gr ON gr.id_user = u.id
     )
     SELECT * FROM ranked WHERE \`rank\` <= :limit OR id = :userId ORDER BY \`rank\` ASC`,
    { replacements: { userId, limit } },
  );

  return rows.map((row) => ({
    rank: row.rank,
    name: row.username,
    elo: row.elo,
    games: row.games,
    winRate: row.games > 0 ? Math.round((row.wins / row.games) * 100) : 0,
    isMe: row.id === userId,
  }));
}

/**
 * The N most recent games for a user, with the opponent and a
 * win/loss/draw result derived from the elo delta of that game.
 * @param {number} userId
 * @param {number} [limit]
 */
async function getRecentGames(userId, limit = 3) {
  const [rows] = await sequelize.query(
    `WITH elo_ordered AS (
       SELECT id_user, id_game, elo, createdAt,
              LAG(elo) OVER (PARTITION BY id_user ORDER BY createdAt) AS prevElo
       FROM \`elo\`
     )
     SELECT g.id AS gameId, g.createdAt, opponent.username AS opponent,
            gu.color, eo.elo - eo.prevElo AS eloChange
     FROM \`game_user\` gu
     JOIN \`game\` g ON g.id = gu.id_game
     JOIN \`game_user\` gu_opp ON gu_opp.id_game = g.id AND gu_opp.id_user != gu.id_user
     JOIN \`user\` opponent ON opponent.id = gu_opp.id_user
     JOIN elo_ordered eo ON eo.id_user = gu.id_user AND eo.id_game = g.id
     WHERE gu.id_user = :userId AND eo.prevElo IS NOT NULL
     ORDER BY g.createdAt DESC
     LIMIT :limit`,
    { replacements: { userId, limit } },
  );

  return rows.map((row) => ({
    gameId: row.gameId,
    opponent: row.opponent,
    color: row.color,
    result: row.eloChange > 0 ? "win" : row.eloChange < 0 ? "loss" : "draw",
    eloChange: row.eloChange,
    createdAt: row.createdAt,
  }));
}

/**
 * Final board position for a game, replayed from its stored moves via
 * the same Chessboard used for live games (server/service/chess) —
 * applyMoveUnchecked() skips legality checks since these moves already
 * happened for real; this only needs to render the resulting position.
 * @param {number|null} gameId
 */
async function getLastGameBoard(gameId) {
  const board = new Chessboard(gameId);
  if (!gameId) return board.toGrid();

  const [moves] = await sequelize.query(
    "SELECT move FROM `state` WHERE id_game = :gameId ORDER BY id ASC",
    { replacements: { gameId } },
  );

  for (const { move } of moves) {
    const from = Chessboard.squareToXY(move.slice(0, 2));
    const to = Chessboard.squareToXY(move.slice(2, 4));
    board.applyMoveUnchecked(from.x, from.y, to.x, to.y);
  }
  return board.toGrid();
}

async function getTotalPlayers() {
  const [[row]] = await sequelize.query("SELECT COUNT(*) AS total FROM `user`");
  return row.total;
}

/**
 * Everything the home dashboard template needs for a given user.
 * @param {number} userId
 */
async function getDashboardData(userId) {
  const [currentElo, eloDeltaMonth, eloHistory, leaderboard, recentGames, totalPlayers] =
    await Promise.all([
      getCurrentElo(userId),
      getEloDeltaThisMonth(userId),
      getEloHistory(userId),
      getLeaderboard(userId),
      getRecentGames(userId),
      getTotalPlayers(),
    ]);

  const ownRank = leaderboard.find((player) => player.isMe)?.rank || null;
  const lastGame = recentGames[0] || null;

  return {
    currentElo,
    eloDeltaMonth,
    eloHistory,
    leaderboard,
    recentGames,
    lastGame,
    lastGameBoard: await getLastGameBoard(lastGame?.gameId),
    topPercent: ownRank ? Math.max(1, Math.round((ownRank / totalPlayers) * 100)) : null,
  };
}

module.exports = { getDashboardData };
