'use strict';

const { faker } = require('@faker-js/faker');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Lấy danh sách user, conversation, message
    const users = await queryInterface.sequelize.query(`SELECT id FROM users`, {
      type: Sequelize.QueryTypes.SELECT,
    });
    const conversations = await queryInterface.sequelize.query(
      `SELECT id FROM conversations`,
      { type: Sequelize.QueryTypes.SELECT }
    );
    const messages = await queryInterface.sequelize.query(
      `SELECT id, conversation_id FROM messages`,
      { type: Sequelize.QueryTypes.SELECT }
    );

    if (!users.length || !conversations.length || !messages.length) {
      throw new Error(
        'Cần seed users, conversations, messages trước khi seed message_reads!'
      );
    }

    const reads = [];

    for (const msg of messages) {
      // mỗi message có 0–3 người đọc
      const readCount = faker.number.int({ min: 0, max: 3 });
      const seenUsers = new Set();

      for (let i = 0; i < readCount; i++) {
        const reader = faker.helpers.arrayElement(users);

        // tránh trùng user đọc cùng 1 message
        if (seenUsers.has(reader.id)) continue;
        seenUsers.add(reader.id);

        reads.push({
          user_id: reader.id,
          conversation_id: msg.conversation_id,
          message_id: msg.id,
          read_at: faker.date.recent({ days: 30 }),
          created_at: new Date(),
          updated_at: new Date(),
        });
      }
    }

    if (reads.length) {
      await queryInterface.bulkInsert('message_reads', reads);
    }
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('message_reads', null, {});
  },
};
