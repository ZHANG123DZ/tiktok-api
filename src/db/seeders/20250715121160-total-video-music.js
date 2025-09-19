'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Lấy danh sách tất cả music
    const [musics] = await queryInterface.sequelize.query(`
      SELECT id FROM musics;
    `);

    for (const music of musics) {
      // Đếm số post có music_id = music.id
      const [[{ count }]] = await queryInterface.sequelize.query(`
        SELECT COUNT(*) as count
        FROM posts
        WHERE music_id = ${music.id};
      `);

      // Update video_count
      await queryInterface.sequelize.query(`
        UPDATE musics
        SET video_count = ${count}
        WHERE id = ${music.id};
      `);
    }
  },

  async down(queryInterface, Sequelize) {
    // rollback: reset video_count về NULL hoặc 0
    await queryInterface.sequelize.query(`
      UPDATE musics
      SET video_count = 0;
    `);
  },
};
