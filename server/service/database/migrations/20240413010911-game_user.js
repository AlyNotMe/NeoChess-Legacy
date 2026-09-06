"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("game_user", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      color: {
        allowNull: false,
        type: Sequelize.ENUM("white", "black"),
      },
      last_move_timestamp: {
        allowNull: false,
        type: Sequelize.DATE, // Timestamp du dernier coup du joueur
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      time_remaining: {
        allowNull: false,
        type: Sequelize.INTEGER, // ou un autre type de données approprié
        defaultValue: 1800, // 30 minutes par défaut
      },
    });
    await queryInterface.addColumn("game_user", "id_game", {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: "game",
        key: "id",
      },
    }),
      await queryInterface.addColumn("game_user", "id_user", {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "user",
          key: "id",
          onDelete: "CASCADE",
          onUpdate: "CASCADE",
        },
      });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("game_user");
  },
};
