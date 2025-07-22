"use strict";

const { faker } = require("@faker-js/faker");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Lấy danh sách user_id hiện có
    const users = await queryInterface.sequelize.query(
      `SELECT id FROM users;`,
      { type: Sequelize.QueryTypes.SELECT }
    );

    if (users.length === 0) {
      console.warn("⚠️ No users found. Cannot seed conversations.");
      return;
    }

    const conversations = [];

    for (let i = 0; i < 50; i++) {
      const randomUser = faker.helpers.arrayElement(users);

      conversations.push({
        user_id: randomUser.id,
        avatar_url: faker.image.avatar(),
        created_at: new Date(),
        updated_at: new Date(),
      });
    }

    await queryInterface.bulkInsert("conversations", conversations);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("conversations", null, {});
  },
};
