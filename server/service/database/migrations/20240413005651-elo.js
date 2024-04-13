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
      },
      {
        compositePrimaryKey: true, // Ajout de la clé primaire composite
      }
    );
    await queryInterface.addColumn("elo", "id_user", {
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
    await queryInterface.dropTable("elo");
  },
};
