"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("state", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      id_game: {
        type: Sequelize.INTEGER,
        references: {
          model: "games",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      id_user: {
        type: Sequelize.INTEGER,
        references: {
          model: "user",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      move: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      time_remaining: {
        allowNull: false,
        type: Sequelize.INTEGER, // ou un autre type de données approprié pour stocker le temps restant
        defaultValue: 1800, // 30 minutes par défaut
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("state");
  },
};
