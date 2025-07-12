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
    const posts = await queryInterface.sequelize.query("SELECT id FROM posts", {
      type: Sequelize.QueryTypes.SELECT,
    });

    const comments = [];

    for (let i = 0; i < 300; i++) {
      const post = faker.helpers.arrayElement(posts);

      const isReply = i > 5 && Math.random() < 0.4 && comments.length > 0;

      comments.push({
        content: faker.lorem.sentences(2),
        post_id: post.id,
        parent_id: isReply ? faker.helpers.arrayElement(comments).id : null,
        created_at: new Date(),
        updated_at: new Date(),
      });
    }

    await queryInterface.bulkInsert("comments", comments);
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete("comments", null, {});
  },
};
