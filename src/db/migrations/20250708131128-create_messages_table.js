"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.createTable("messages", {
      id: {
        type: Sequelize.BIGINT.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      user_id: {
        type: Sequelize.BIGINT.UNSIGNED,
        references: {
          model: "users",
          key: "id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      conversation_id: {
        type: Sequelize.BIGINT.UNSIGNED,
        references: {
          model: "conversations",
          key: "id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      content: {
        type: Sequelize.TEXT,
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
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.dropTable("messages");
  },
};
