"use strict";

/** @type {import('sequelize-cli').Migration} */

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable(
      "comments",
      {
        id: {
          type: Sequelize.BIGINT.UNSIGNED,
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
        },

        post_id: {
          type: Sequelize.BIGINT.UNSIGNED,
          references: {
            model: "posts",
            key: "id",
          },
          onDelete: "CASCADE",
          onUpdate: "CASCADE",
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

        content: {
          type: Sequelize.TEXT,
        },

        parent_id: {
          type: Sequelize.BIGINT.UNSIGNED,
          references: {
            model: "comments",
            key: "id",
          },
          onDelete: "SET NULL",
          onUpdate: "CASCADE",
        },
        like_count: {
          type: Sequelize.BIGINT,
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
      },
      {
        timestamps: true,
        underscored: true,
        charset: "utf8",
        collate: "utf8_general_ci",
        engine: "InnoDB",
      }
    );

    // Indexes for fast lookup
    await queryInterface.addIndex("comments", ["post_id"]);
    await queryInterface.addIndex("comments", ["user_id"]);
    await queryInterface.addIndex("comments", ["parent_id"]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("comments");
  },
};
