"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // A player can only have one row per game...
    await queryInterface.addConstraint("game_user", {
      fields: ["id_game", "id_user"],
      type: "unique",
      name: "game_user_unique_id_game_id_user",
    });
    // ...and only one player per color per game (prevents both players
    // ending up "white", which the app-level assignColor() logic assumes
    // can't happen).
    await queryInterface.addConstraint("game_user", {
      fields: ["id_game", "color"],
      type: "unique",
      name: "game_user_unique_id_game_color",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeConstraint("game_user", "game_user_unique_id_game_color");
    await queryInterface.removeConstraint("game_user", "game_user_unique_id_game_id_user");
  },
};
