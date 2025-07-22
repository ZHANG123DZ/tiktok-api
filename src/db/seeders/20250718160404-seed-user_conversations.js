"use strict";

const { faker } = require("@faker-js/faker");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Lấy tất cả user_id và conversation_id
    const users = await queryInterface.sequelize.query(
      `SELECT id FROM users;`,
      { type: Sequelize.QueryTypes.SELECT }
    );

    const conversations = await queryInterface.sequelize.query(
      `SELECT id FROM conversations;`,
      { type: Sequelize.QueryTypes.SELECT }
    );

    const userConversations = [];

    // Giả định mỗi conversation có từ 2–4 người tham gia
    for (const conv of conversations) {
      const participantCount = faker.number.int({ min: 2, max: 4 });
      const shuffledUsers = faker.helpers
        .shuffle(users)
        .slice(0, participantCount);

      for (const user of shuffledUsers) {
        userConversations.push({
          user_id: user.id,
          conversation_id: conv.id,
          created_at: new Date(),
          updated_at: new Date(),
        });
      }
    }

    await queryInterface.bulkInsert(
      "user_conversations",
      userConversations,
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("user_conversations", null, {});
  },
};
