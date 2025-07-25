"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const [posts] = await queryInterface.sequelize.query(
      `SELECT id FROM posts`
    );
    const [topics] = await queryInterface.sequelize.query(
      `SELECT id FROM topics`
    );

    const postTopics = [];

    for (const post of posts) {
      // Mỗi bài viết được gán 1 đến 3 topic ngẫu nhiên
      const randomTopics = topics
        .sort(() => 0.5 - Math.random())
        .slice(0, Math.floor(Math.random() * 3) + 1);

      for (const topic of randomTopics) {
        postTopics.push({
          post_id: post.id,
          topic_id: topic.id,
          created_at: new Date(),
          updated_at: new Date(),
        });
      }
    }

    await queryInterface.bulkInsert("post_topics", postTopics);
    await queryInterface.sequelize.query(`
      UPDATE topics
      SET post_count = (
        SELECT COUNT(*) FROM post_topics WHERE topic_id = topics.id
      )
    `);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("post_topics", null, {});
    await queryInterface.sequelize.query(`
      UPDATE topics SET post_count = 0
    `);
  },
};
