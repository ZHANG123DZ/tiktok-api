"use strict";
const { faker } = require("@faker-js/faker");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */
    const topics = await queryInterface.sequelize.query(
      "SELECT id FROM topics",
      { type: Sequelize.QueryTypes.SELECT }
    );
    const posts = [];
    const usedSlug = new Set();

    for (let i = 0; i < 50; i++) {
      let title = faker.lorem.sentence(4);
      let slug = faker.helpers.slugify(title.toLocaleLowerCase());

      while (usedSlug.has(slug)) {
        title = faker.lorem.sentence(4);
        slug = faker.helpers.slugify(title.toLocaleLowerCase());
      }
      usedSlug.add(slug);

      posts.push({
        title,
        content: faker.lorem.paragraph(3),
        slug,
        status: faker.helpers.arrayElement(["active", "draft", "banned"]),
        topic_id: faker.helpers.arrayElement(topics).id,
        created_at: new Date(),
        updated_at: new Date(),
      });
    }
    await queryInterface.bulkInsert("posts", posts);
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete("posts", null, {});
  },
};
