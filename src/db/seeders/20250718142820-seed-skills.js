"use strict";

const { faker } = require("@faker-js/faker");

module.exports = {
  async up(queryInterface, Sequelize) {
    const skillNames = [
      "React",
      "Vue",
      "Angular",
      "TypeScript",
      "Node.js",
      "GraphQL",
      "Docker",
      "Kubernetes",
      "AWS",
      "SQL",
      "NoSQL",
      "Python",
      "Java",
      "Go",
      "Rust",
    ];

    const skills = skillNames.map((name) => ({
      name,
      created_at: new Date(),
      updated_at: new Date(),
    }));

    await queryInterface.bulkInsert("skills", skills);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("skills", null, {});
  },
};
