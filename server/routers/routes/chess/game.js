/*************************************************************
 *
 * Game router with get http verb
 *
 *************************************************************/

const Route = require("../../route.js");
const { Game, GameUser } = require("../../../service/database/models/"); // Importe les modèles Game et GameUser

const route = new Route();

const get = route.route("/:language?/game/:id", async (req, res) => {
  const translate = req.load("chess/game");
  const langName = req.params.language || config.default_language;

  const game = await Game.findByPk(req.params.id);

  /** if game doesn't exist */
  if (!game) return res.sendStatus(404);

  // Rend la page du jeu indépendamment du nombre de joueurs
  if (translate) {
    res.render("chess/game", {
      translate,
      langName,
      h: req.helper,
      gameId: req.params.id,
    });
  }
});

module.exports = { get };
