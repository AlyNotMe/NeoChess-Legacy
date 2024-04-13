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
    await queryInterface.addColumn('state', "id_game", {
        type: Sequelize.INTEGER, 
        allowNull: false, 
        references: {
            model: "game",
            key: "id",
        }
      }),
      await queryInterface.addColumn('state', "id_user", {
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
    await queryInterface.dropTable("state");
  },
};
