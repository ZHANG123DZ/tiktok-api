'use strict';

const { faker } = require('@faker-js/faker');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const conversations = [];

    // 20 group conversations
    for (let i = 0; i < 20; i++) {
      conversations.push({
        avatar: faker.image.avatar(),
        name: faker.company.name() + ' Group',
        is_group: true, // snake_case
        created_at: new Date(), // snake_case
        updated_at: new Date(),
        deleted_at: null,
      });
    }

    // 10 private conversations
    for (let i = 0; i < 10; i++) {
      conversations.push({
        avatar: faker.image.avatar(),
        name: faker.person.fullName(),
        is_group: false,
        created_at: new Date(),
        updated_at: new Date(),
        deleted_at: null,
      });
    }

    await queryInterface.bulkInsert('conversations', conversations, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('conversations', null, {});
  },
};
