"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Align the DB column with the model field name (friendship.js uses
    // `friendship_id`, the original migration created `friend_id`).
    await queryInterface.renameColumn("friendship", "friend_id", "friendship_id");
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.renameColumn("friendship", "friendship_id", "friend_id");
  },
};
