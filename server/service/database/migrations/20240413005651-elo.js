"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      "elo",
      {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER,
        },
        elo: {
          allowNull: false,
          type: Sequelize.INTEGER,
          defaultValue: 1000,
        },
        id_user: {
          allowNull: false,
          type: Sequelize.INTEGER,
          references: {
            model: "user",
            key: "id",
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
          },
        },
      },
      {
        compositePrimaryKey: true, // Ajout de la clé primaire composite
      }
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("elo");
  },
};
