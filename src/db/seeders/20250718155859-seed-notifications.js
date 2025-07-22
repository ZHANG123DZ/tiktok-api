"use strict";

const { faker } = require("@faker-js/faker");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Lấy danh sách user và post giả định (tùy app bạn cần lấy đúng ID có trong DB)
    const users = await queryInterface.sequelize.query(`SELECT id FROM users;`);
    const posts = await queryInterface.sequelize.query(`SELECT id FROM posts;`);
    const comments = await queryInterface.sequelize.query(
      `SELECT id FROM comments;`
    );

    const userRows = users[0];
    const postRows = posts[0];
    const commentRows = comments[0];

    const notifications = [];

    for (let i = 0; i < 100; i++) {
      const user = faker.helpers.arrayElement(userRows);
      const type = faker.helpers.arrayElement(["post", "comment"]);

      const notifiable =
        type === "post"
          ? faker.helpers.arrayElement(postRows)
          : faker.helpers.arrayElement(commentRows);

      notifications.push({
        type: faker.helpers.arrayElement([
          "new_post",
          "new_comment",
          "like",
          "follow",
        ]),
        user_id: user.id,
        notifiable_id: notifiable?.id || 1, // fallback nếu thiếu dữ liệu
        notifiable_type: type === "post" ? "Post" : "Comment",
        created_at: new Date(),
        updated_at: new Date(),
      });
    }

    await queryInterface.bulkInsert("notifications", notifications);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("notifications", null, {});
  },
};
