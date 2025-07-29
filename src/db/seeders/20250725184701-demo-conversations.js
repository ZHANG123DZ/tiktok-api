"use strict";
const { faker } = require("@faker-js/faker");

/** @type {import('sequelize-cli').Seeder} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();
    const conversations = Array.from({ length: 10 }).map(() => ({
      avatar_url: faker.image.avatar(), // URL ảnh giả
      created_at: now,
      updated_at: now,
    }));

    await queryInterface.bulkInsert("conversations", conversations);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("conversations", null, {});
  },
};
