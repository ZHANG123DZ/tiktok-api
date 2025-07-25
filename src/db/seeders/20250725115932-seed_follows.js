"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    console.log("🔍 Bắt đầu seed follows...");

    // 1. Lấy danh sách user
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

    // 2. Sinh dữ liệu follow
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
          follow_able_type: "user",
          created_at: new Date(),
          updated_at: new Date(),
        });
      }
    }

    console.log(`📦 Chuẩn bị insert ${follows.length} follows...`);

    // 3. Kiểm tra lỗi dữ liệu trước khi insert
    const invalids = follows.filter(
      (f) =>
        !f.user_id ||
        !f.follow_able_id ||
        !f.follow_able_type ||
        !f.created_at ||
        !f.updated_at
    );

    if (invalids.length > 0) {
      console.error(`❌ Có ${invalids.length} record thiếu dữ liệu cần thiết.`);
      console.log("🔎 Ví dụ record lỗi:", invalids.slice(0, 2));
      throw new Error("Validation failed: dữ liệu không hợp lệ.");
    }

    // 4. Thực hiện insert
    await queryInterface.bulkInsert("follows", follows);

    console.log("✅ Seed follows thành công.");
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("follows", null, {});
    console.log("🧹 Đã xóa toàn bộ follows.");
  },
};
