"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("friendship", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      status: {
        allowNull: false,
        type: Sequelize.ENUM("pending", "accepted", "rejected"),
        defaultValue: "pending",
      },
    }),
      await queryInterface.addColumn("friendship", "id_user", {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "user",
          key: "id",
          onDelete: "CASCADE",
          onUpdate: "CASCADE",
        },
      }),
      await queryInterface.addColumn("friendship", "friend_id", {
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
    await queryInterface.dropTable("friendship");
  },
};
