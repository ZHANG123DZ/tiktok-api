'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Lấy dữ liệu từ bảng tiktok_musics
    const [tiktokMusics] = await queryInterface.sequelize.query(
      `SELECT id, tiktok_id, audio, thumbnail, created_at, updated_at FROM tiktok_musics`
    );

    // Lấy danh sách user ids
    const [userIds] = await queryInterface.sequelize.query(
      `SELECT id FROM users`
    );

    if (tiktokMusics.length === 0 || userIds.length === 0) return;

    // Map dữ liệu sang format của musics
    const musics = tiktokMusics.map((item) => {
      // chọn ngẫu nhiên 1 userId
      const randomUser = userIds[Math.floor(Math.random() * userIds.length)];

      return {
        name: `TikTok Music ${item.tiktok_id}`, // Vì tiktok_musics không có name → đặt tạm
        author_id: randomUser.id,
        slug: `tiktok-music-${item.tiktok_id}`,
        audio: item.audio,
        thumbnail: item.thumbnail,
        video_count: 0, // có thể tính sau
        created_at: item.created_at || new Date(),
        updated_at: item.updated_at || new Date(),
      };
    });

    // Insert vào musics
    await queryInterface.bulkInsert('musics', musics, {});
  },

  async down(queryInterface, Sequelize) {
    // Xoá các musics có slug bắt đầu bằng 'tiktok-music-'
    await queryInterface.bulkDelete('musics', {
      slug: {
        [Sequelize.Op.like]: 'tiktok-music-%',
      },
    });
  },
};
