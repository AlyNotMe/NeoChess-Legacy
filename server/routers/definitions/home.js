/*************************************************************
 *
 * Home router with get http verb
 *
 *************************************************************/

const Route = require("../routeRegistry.js");
const route = new Route();
const { getDashboardData } = require("../../service/dashboard/dashboardService.js");

const get = route.route("/", async (req, res) => {
  const translate = req.load("home");
  const langName = req.params.language || req.config.default_language;

  if (translate) {
    const dashboard = await getDashboardData(req.session.user.id);
    res.render("home", {
      translate,
      langName,
      h: req.helper,
      user: req.session.user,
      currentElo: dashboard.currentElo,
      eloDeltaMonth: dashboard.eloDeltaMonth,
      eloHistory: dashboard.eloHistory,
      leaderboard: dashboard.leaderboard,
      recentGames: dashboard.recentGames,
      lastGame: dashboard.lastGame,
      lastGameBoard: dashboard.lastGameBoard,
      topPercent: dashboard.topPercent,
    });
  }
});

module.exports = { get };
