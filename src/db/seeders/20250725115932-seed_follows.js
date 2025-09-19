'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    console.log('🔍 Bắt đầu seed follows...');

    const users = await queryInterface.sequelize.query(`SELECT id FROM users`, {
      type: Sequelize.QueryTypes.SELECT,
    });

    console.log(`✅ Tìm thấy ${users.length} user.`);

    const userIds = users.map((u) => u.id);
    const follows = [];

    const getRandomUserId = (excludeId) => {
      let id;
      do {
        id = userIds[Math.floor(Math.random() * userIds.length)];
      } while (id === excludeId);
      return id;
    };

    for (const user of userIds) {
      const count = Math.floor(Math.random() * 100);
      const uniqueFollowed = new Set();

      while (uniqueFollowed.size < count) {
        const followId = getRandomUserId(user);
        uniqueFollowed.add(followId);
      }

      for (const follow_able_id of uniqueFollowed) {
        follows.push({
          user_id: user,
          follow_able_id,
          follow_able_type: 'user',
          created_at: new Date(),
          updated_at: new Date(),
        });
      }
    }

    console.log(`📦 Chuẩn bị insert ${follows.length} follows...`);

    // Chia nhỏ batch (5000 bản ghi/lần)
    const batchSize = 5000;
    for (let i = 0; i < follows.length; i += batchSize) {
      const batch = follows.slice(i, i + batchSize);
      await queryInterface.bulkInsert('follows', batch);
      console.log(`✅ Đã insert ${i + batch.length}/${follows.length}`);
    }

    console.log('🎉 Seed follows thành công.');
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('follows', null, {});
    console.log('🧹 Đã xóa toàn bộ follows.');
  },
};
