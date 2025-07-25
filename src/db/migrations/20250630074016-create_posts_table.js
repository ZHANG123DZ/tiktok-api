"use strict";

/** @type {import('sequelize-cli').Migration} */

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable(
      "posts",
      {
        id: {
          type: Sequelize.BIGINT.UNSIGNED,
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
        },
        title: {
          type: Sequelize.STRING(191),
          defaultValue: "",
        },
        slug: {
          type: Sequelize.STRING(191),
          unique: true,
        },
        content: {
          type: Sequelize.TEXT,
        },
        excerpt: {
          type: Sequelize.TEXT,
        },
        description: {
          type: Sequelize.TEXT,
        },
        author_id: {
          type: Sequelize.BIGINT.UNSIGNED,
          references: {
            model: "users",
            key: "id",
          },
          onDelete: "CASCADE",
          onUpdate: "CASCADE",
        },
        author_name: {
          type: Sequelize.STRING(191),
        },
        author_username: {
          type: Sequelize.STRING(191),
        },
        author_avatar: {
          type: Sequelize.STRING(191),
        },
        meta_title: {
          type: Sequelize.STRING(191),
          defaultValue: "",
        },
        meta_description: {
          type: Sequelize.STRING(191),
          defaultValue: "",
        },
        status: {
          type: Sequelize.STRING(50),
          defaultValue: "draft",
        },
        view_count: {
          type: Sequelize.BIGINT.UNSIGNED,
          defaultValue: 0,
        },
        like_count: {
          type: Sequelize.BIGINT.UNSIGNED,
          defaultValue: 0,
        },
        comment_count: {
          type: Sequelize.BIGINT.UNSIGNED,
          defaultValue: 0,
        },
        report_count: {
          type: Sequelize.BIGINT.UNSIGNED,
          defaultValue: 0,
        },

        language: {
          type: Sequelize.STRING(191),
        },
        visibility: {
          type: Sequelize.ENUM("public", "private", "unlisted"),
          defaultValue: "public",
        },
        moderation_status: {
          type: Sequelize.ENUM("approved", "pending", "rejected"),
          defaultValue: "approved",
        },
        cover_url: {
          type: Sequelize.STRING(255),
        },
        thumbnail_url: {
          type: Sequelize.STRING(255),
        },
        reading_time: {
          type: Sequelize.INTEGER.UNSIGNED,
          defaultValue: 0,
        },

        is_pinned: {
          type: Sequelize.TINYINT(1).UNSIGNED,
          defaultValue: 0,
        },
        is_featured: {
          type: Sequelize.TINYINT(1).UNSIGNED,
          defaultValue: 0,
        },
        has_media: {
          type: Sequelize.TINYINT(1).UNSIGNED,
          defaultValue: 0,
        },
        visibility_updated_at: {
          type: Sequelize.DATE(6),
        },
        published_at: {
          type: Sequelize.DATE(6),
          defaultValue: Sequelize.literal("CURRENT_TIMESTAMP(6)"),
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

    // Indexes
    await queryInterface.addIndex("posts", ["author_id"]);
    await queryInterface.addIndex("posts", ["visibility"]);
    await queryInterface.addIndex("posts", ["created_at"]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("posts");
  },
};
