"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // elo is a history table (one row per rating change), not a single
    // current value per user — needs timestamps to plot it over time.
    await queryInterface.addColumn("elo", "createdAt", {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
    });
    await queryInterface.addColumn("elo", "updatedAt", {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
    });

    // Nullable: an elo entry isn't always tied to a game (e.g. the
    // initial value seeded on registration).
    await queryInterface.addColumn("elo", "id_game", {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: "game",
        key: "id",
      },
      onDelete: "SET NULL",
      onUpdate: "CASCADE",
    });

    // Speeds up "elo history for this user, ordered by date" queries
    // (the line chart) without enforcing uniqueness.
    await queryInterface.addIndex("elo", ["id_user", "createdAt"], {
      name: "elo_id_user_created_at_idx",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeIndex("elo", "elo_id_user_created_at_idx");
    await queryInterface.removeColumn("elo", "id_game");
    await queryInterface.removeColumn("elo", "updatedAt");
    await queryInterface.removeColumn("elo", "createdAt");
  },
};
