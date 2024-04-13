"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("gamemode", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      libelle: {
        allowNull: false,
        type: Sequelize.STRING,
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("gamemode");
  },
};
