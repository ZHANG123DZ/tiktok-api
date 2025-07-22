"use strict";

const { faker } = require("@faker-js/faker");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Lấy user_id và skill_id hiện có
    const users = await queryInterface.sequelize.query(
      `SELECT id FROM users;`,
      { type: Sequelize.QueryTypes.SELECT }
    );

    const skills = await queryInterface.sequelize.query(
      `SELECT id FROM skills;`,
      { type: Sequelize.QueryTypes.SELECT }
    );

    const userSkills = [];

    for (const user of users) {
      const skillCount = faker.number.int({ min: 1, max: 5 });
      const randomSkills = faker.helpers.shuffle(skills).slice(0, skillCount);

      for (const skill of randomSkills) {
        userSkills.push({
          user_id: user.id,
          skill_id: skill.id,
          created_at: new Date(),
          updated_at: new Date(),
        });
      }
    }

    await queryInterface.bulkInsert("user_skills", userSkills, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("user_skills", null, {});
  },
};
