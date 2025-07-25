"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("topics", {
      id: {
        type: Sequelize.BIGINT.UNSIGNED,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
      },
      name: {
        type: Sequelize.STRING(100),
        unique: true,
      },
      slug: {
        type: Sequelize.STRING(100),
        unique: true,
      },
      description: {
        type: Sequelize.TEXT,
      },
      icon_url: {
        type: Sequelize.STRING(255),
      },
      post_count: {
        type: Sequelize.INTEGER.UNSIGNED,
        defaultValue: 0,
      },
      created_at: {
        type: Sequelize.DATE(6),
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP(6)"),
      },
      updated_at: {
        type: Sequelize.DATE(6),
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP(6)"),
        onUpdate: Sequelize.literal("CURRENT_TIMESTAMP(6)"),
      },
      deleted_at: {
        type: Sequelize.DATE(6),
      },
    });

    await queryInterface.addIndex("topics", ["slug"]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("topics");
  },
};
