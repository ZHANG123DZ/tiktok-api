"use strict";
const { faker } = require("@faker-js/faker");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const users = await queryInterface.sequelize.query(`SELECT id FROM users`, {
      type: Sequelize.QueryTypes.SELECT,
    });
    const posts = await queryInterface.sequelize.query(`SELECT id FROM posts`, {
      type: Sequelize.QueryTypes.SELECT,
    });

    if (!users.length || !posts.length) {
      throw new Error("Seed users & posts trước khi seed comments!");
    }

    /* -------- 1. Insert 800 comment gốc -------- */
    const rootComments = [];
    for (let i = 0; i < 800; i++) {
      const user = faker.helpers.arrayElement(users);
      const post = faker.helpers.arrayElement(posts);

      rootComments.push({
        post_id: post.id,
        user_id: user.id,
        content: faker.lorem.sentences(3),
        parent_id: null,
        like_count: faker.number.int({ min: 0, max: 300 }),
        created_at: faker.date.recent({ days: 30 }),
        updated_at: new Date(),
      });
    }

    // bulkInsert & lấy lại ID thật
    await queryInterface.bulkInsert("comments", rootComments);

    // Lấy ID thật của 800 comment vừa chèn
    const insertedRoots = await queryInterface.sequelize.query(
      `SELECT id, post_id FROM comments ORDER BY id DESC LIMIT 800`,
      { type: Sequelize.QueryTypes.SELECT }
    );

    /* -------- 2. Sinh reply (0‑3 mỗi comment) -------- */
    const replies = [];
    for (const root of insertedRoots) {
      const replyCount = faker.number.int({ min: 0, max: 3 });
      for (let j = 0; j < replyCount; j++) {
        const replyUser = faker.helpers.arrayElement(users);
        replies.push({
          post_id: root.post_id,
          user_id: replyUser.id,
          content: faker.lorem.sentences(2),
          parent_id: root.id,
          created_at: faker.date.recent({ days: 30 }),
          updated_at: new Date(),
        });
      }
    }

    if (replies.length) {
      await queryInterface.bulkInsert("comments", replies);
    }

    /* -------- 3. Cập nhật comment_count của mỗi post -------- */
    await queryInterface.sequelize.query(`
      UPDATE posts
      SET comment_count = (
        SELECT COUNT(*)
        FROM comments
        WHERE comments.post_id = posts.id
      )
    `);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("comments", null);

    // Reset comment_count về 0
    await queryInterface.sequelize.query(`UPDATE posts SET comment_count = 0`);
  },
};
