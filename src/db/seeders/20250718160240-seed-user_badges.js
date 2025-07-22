"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const [users] = await queryInterface.sequelize.query(
      `SELECT id FROM users`
    );
    const [badges] = await queryInterface.sequelize.query(
      `SELECT id FROM badges`
    );

    const userBadges = [];

    for (const user of users) {
      const shuffledBadges = badges.sort(() => 0.5 - Math.random());
      const count = Math.floor(Math.random() * 4); // 0 - 3 badges

      for (let i = 0; i < count; i++) {
        userBadges.push({
          user_id: user.id,
          badge_id: shuffledBadges[i].id,
          created_at: new Date(),
          updated_at: new Date(),
        });
      }
    }

    await queryInterface.bulkInsert("user_badges", userBadges);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("user_badges", null, {});
  },
};
