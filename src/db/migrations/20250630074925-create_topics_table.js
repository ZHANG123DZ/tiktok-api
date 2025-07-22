"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("topics", {
      id: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: Sequelize.STRING(100),
        allowNull: false,
        unique: true,
      },
      slug: {
        type: Sequelize.STRING(100),
        allowNull: false,
        unique: true,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      icon_url: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      post_count: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        defaultValue: 0,
      },
      created_at: {
        type: Sequelize.DATE(6),
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP(6)"),
      },
      updated_at: {
        type: Sequelize.DATE(6),
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP(6)"),
        onUpdate: Sequelize.literal("CURRENT_TIMESTAMP(6)"),
      },
      deleted_at: {
        type: Sequelize.DATE(6),
        allowNull: true,
      },
    });

    await queryInterface.addIndex("topics", ["slug"]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("topics");
  },
};
