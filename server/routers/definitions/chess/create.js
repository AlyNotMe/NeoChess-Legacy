// gameRouter.js

const Route = require("../../routeRegistry.js");
const route = new Route();
const { Game, GameUser } = require("../../../service/database/index.js");

const post = route.route("/:language?/game/create", async (req, res) => {
  try {
    const langName = req.params.language || req.config.default_language;

    // Création de la partie
    const game = await Game.create();

    // Obtention des IDs des utilisateurs à partir du corps de la requête
    const { userIdWhite, userIdBlack } = req.body;

    // Création du joueur white
    await GameUser.create({
      idGame: game.id,
      idUser: userIdWhite,
      color: "white",
    });

    // Création du joueur black
    await GameUser.create({
      idGame: game.id,
      idUser: userIdBlack,
      color: "black",
    });

    // Redirection vers la page de la nouvelle partie
    res.status(200).redirect(`/${langName}/game/${game.id}`);
  } catch (error) {
    console.error("Error creating game:", error);
    res
      .status(500)
      .send("Une erreur est survenue lors de la création de la partie.");
  }
});

module.exports = { post };
