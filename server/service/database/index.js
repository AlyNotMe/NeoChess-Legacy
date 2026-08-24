const db = require("./models/index.js");

module.exports = {
  sequelize: db.sequelize,
  User: db.user,
  Game: db.game,
  GameUser: db.game_user,
  Gamemode: db.gamemode,
  Elo: db.elo,
  Friendship: db.friendship,
  State: db.state,
};
