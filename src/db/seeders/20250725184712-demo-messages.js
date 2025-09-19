'use strict';

const { faker } = require('@faker-js/faker');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // 1. Lấy users & conversations
    const users = await queryInterface.sequelize.query(`SELECT id FROM users`, {
      type: Sequelize.QueryTypes.SELECT,
    });
    const conversations = await queryInterface.sequelize.query(
      `SELECT id FROM conversations`,
      { type: Sequelize.QueryTypes.SELECT }
    );

    if (!users.length || !conversations.length) {
      throw new Error(
        'Cần seed users & conversations trước khi seed messages!'
      );
    }

    const messages = [];

    // 2. Tạo ~500 tin nhắn gốc
    for (let i = 0; i < 500; i++) {
      const user = faker.helpers.arrayElement(users);
      const conv = faker.helpers.arrayElement(conversations);

      messages.push({
        user_id: user.id,
        conversation_id: conv.id,
        parent_id: null,
        content: faker.lorem.sentence(),
        reactions: null,
        created_at: faker.date.recent({ days: 30 }),
        updated_at: new Date(),
        deleted_at: null,
      });
    }

    // Insert và lấy lại id
    await queryInterface.bulkInsert('messages', messages);
    const insertedMessages = await queryInterface.sequelize.query(
      `SELECT id, conversation_id FROM messages ORDER BY id DESC LIMIT 500`,
      { type: Sequelize.QueryTypes.SELECT }
    );

    // 3. Sinh reply (0–3 mỗi message)
    const replies = [];
    for (const msg of insertedMessages) {
      const replyCount = faker.number.int({ min: 0, max: 3 });
      for (let j = 0; j < replyCount; j++) {
        const replyUser = faker.helpers.arrayElement(users);
        replies.push({
          user_id: replyUser.id,
          conversation_id: msg.conversation_id,
          parent_id: msg.id,
          content: faker.lorem.sentence(),
          reactions: null,
          created_at: faker.date.recent({ days: 30 }),
          updated_at: new Date(),
          deleted_at: null,
        });
      }
    }

    if (replies.length) {
      await queryInterface.bulkInsert('messages', replies);
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('messages', null, {});
  },
};
