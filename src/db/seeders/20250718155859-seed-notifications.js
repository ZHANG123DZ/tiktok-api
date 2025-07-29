"use strict";

const { faker } = require("@faker-js/faker");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Lấy dữ liệu hiện có từ DB
    const [userRows] = await queryInterface.sequelize.query(
      `SELECT id FROM users;`
    );
    const [postRows] = await queryInterface.sequelize.query(
      `SELECT id FROM posts;`
    );
    const [commentRows] = await queryInterface.sequelize.query(
      `SELECT id FROM comments;`
    );

    const notifications = [];

    for (let i = 0; i < 100; i++) {
      const user = faker.helpers.arrayElement(userRows);

      // Chọn loại thông báo
      const type = faker.helpers.arrayElement([
        "new_post",
        "new_comment",
        "like",
        "follow",
      ]);

      let notifiable_id;
      let notifiable_type;

      if (type === "follow") {
        // follow → liên kết với User
        const targetUser = faker.helpers.arrayElement(userRows);
        notifiable_id = targetUser.id;
        notifiable_type = "User";
      } else if (type === "new_comment") {
        // new_comment → liên kết với Comment
        const comment = faker.helpers.arrayElement(commentRows);
        notifiable_id = comment?.id || 1;
        notifiable_type = "Comment";
      } else {
        // new_post hoặc like → liên kết với Post
        const post = faker.helpers.arrayElement(postRows);
        notifiable_id = post?.id || 1;
        notifiable_type = "Post";
      }

      notifications.push({
        type,
        user_id: user.id,
        notifiable_id,
        notifiable_type,
        created_at: new Date(),
        updated_at: new Date(),
        read_at: new Date(),
      });
    }

    await queryInterface.bulkInsert("notifications", notifications);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("notifications", null, {});
  },
};
