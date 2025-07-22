"use strict";

const { faker } = require("@faker-js/faker");
const { slugify } = require("transliteration"); // Đảm bảo cài: npm i transliteration

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const tags = [];

    for (let i = 0; i < 30; i++) {
      const name = faker.lorem.words({ min: 1, max: 2 }).replace(".", "");
      tags.push({
        name,
        slug: slugify(name),
        description: faker.lorem.sentence(),
        post_count: faker.number.int({ min: 0, max: 1000 }),
        created_at: new Date(),
        updated_at: new Date(),
      });
    }

    await queryInterface.bulkInsert("tags", tags);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("tags", null, {});
  },
};
