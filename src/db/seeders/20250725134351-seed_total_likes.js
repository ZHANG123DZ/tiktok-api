"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Lấy tổng like_count theo author_id từ bảng posts
    const [results] = await queryInterface.sequelize.query(`
      SELECT author_id, SUM(like_count) AS total_likes
      FROM posts
      WHERE deleted_at IS NULL
      GROUP BY author_id
    `);

    // Cập nhật lại bảng users theo từng author_id
    for (const row of results) {
      await queryInterface.sequelize.query(`
        UPDATE users
        SET like_count = ${row.total_likes}
        WHERE id = ${row.author_id}
      `);
    }
  },

  down: async (queryInterface, Sequelize) => {
    // Revert: Đặt like_count của tất cả user về 0
    await queryInterface.sequelize.query(`
      UPDATE users
      SET like_count = 0
    `);
  },
};
