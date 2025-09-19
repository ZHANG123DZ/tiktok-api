'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const [users] = await queryInterface.sequelize.query(
      `SELECT id FROM users`
    );
    const [posts] = await queryInterface.sequelize.query(
      `SELECT id FROM posts`
    );
    const [comments] = await queryInterface.sequelize.query(
      `SELECT id FROM comments`
    );

    const likes = [];

    // Giới hạn số lượng like để tránh quá tải
    const getRandomUsers = (count) => {
      return users
        .sort(() => 0.5 - Math.random())
        .slice(0, Math.floor(Math.random() * count) + 1);
    };

    // Gán like cho post
    for (const post of posts) {
      const randomUsers = getRandomUsers(5); // mỗi post được 1–5 user like

      for (const user of randomUsers) {
        likes.push({
          user_id: user.id,
          like_able_id: post.id,
          like_able_type: 'post',
          created_at: new Date(),
          updated_at: new Date(),
        });
      }
    }

    // Gán like cho comment
    for (const comment of comments) {
      const randomUsers = getRandomUsers(3); // mỗi comment được 1–3 user like

      for (const user of randomUsers) {
        likes.push({
          user_id: user.id,
          like_able_id: comment.id,
          like_able_type: 'comment',
          created_at: new Date(),
          updated_at: new Date(),
        });
      }
    }

    // Insert all likes
    await queryInterface.bulkInsert('likes', likes);

    // Cập nhật like_count cho Post
    await queryInterface.sequelize.query(`
      UPDATE posts SET like_count = (
        SELECT COUNT(*) FROM likes
        WHERE like_able_type = 'post' AND like_able_id = posts.id
      )
    `);

    // Cập nhật like_count cho Comment
    await queryInterface.sequelize.query(`
      UPDATE comments SET like_count = (
        SELECT COUNT(*) FROM likes
        WHERE like_able_type = 'comment' AND like_able_id = comments.id
      )
    `);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('likes', null, {});

    // Reset like_count về 0 khi rollback
    await queryInterface.sequelize.query(`UPDATE posts SET like_count = 0`);
    await queryInterface.sequelize.query(`UPDATE comments SET like_count = 0`);
  },
};
