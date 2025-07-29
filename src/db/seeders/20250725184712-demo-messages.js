"use strict";
const { faker } = require("@faker-js/faker");

/** @type {import('sequelize-cli').Seeder} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Lấy danh sách conversations
    const conversations = await queryInterface.sequelize.query(
      `SELECT id FROM conversations;`,
      { type: Sequelize.QueryTypes.SELECT }
    );

    // Lấy danh sách users
    const users = await queryInterface.sequelize.query(
      `SELECT id FROM users;`,
      { type: Sequelize.QueryTypes.SELECT }
    );

    const messages = [];
    const now = new Date();

    for (const conversation of conversations) {
      const conversationId = conversation.id;

      // Tạo 5 message cho mỗi conversation
      for (let i = 0; i < 5; i++) {
        const randomUser = faker.helpers.arrayElement(users);
        messages.push({
          user_id: randomUser.id,
          conversation_id: conversationId,
          content: faker.lorem.sentences({ min: 1, max: 2 }),
          created_at: now,
          updated_at: now,
        });
      }
    }

    await queryInterface.bulkInsert("messages", messages);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("messages", null, {});
  },
};
