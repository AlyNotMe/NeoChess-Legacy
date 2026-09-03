"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Prevents duplicate friend requests between the same two users.
    await queryInterface.addConstraint("friendship", {
      fields: ["id_user", "friendship_id"],
      type: "unique",
      name: "friendship_unique_id_user_friendship_id",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeConstraint("friendship", "friendship_unique_id_user_friendship_id");
  },
};
