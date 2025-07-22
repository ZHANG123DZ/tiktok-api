"use strict";

/** @type {import('sequelize-cli').Migration} */

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable(
      "user_settings",
      {
        user_id: {
          type: Sequelize.BIGINT.UNSIGNED,
          allowNull: false,
          primaryKey: true,
          references: {
            model: "users",
            key: "id",
          },
          onDelete: "CASCADE",
          onUpdate: "CASCADE",
        },

        // Giao diện
        theme: {
          type: Sequelize.ENUM("dark", "light"),
          allowNull: true,
          defaultValue: "light",
        },
        language: {
          type: Sequelize.STRING(100),
          allowNull: true,
          defaultValue: "english",
        },
        profileVisibility: {
          type: Sequelize.ENUM("public", "followers", "private"),
          allowNull: true,
          defaultValue: "public",
        },

        defaultPostVisibility: {
          type: Sequelize.ENUM("public", "private", "draft"),
          allowNull: true,
          defaultValue: "public",
        },
        requireCommentApproval: {
          type: Sequelize.TINYINT(1),
          allowNull: true,
          defaultValue: 0,
        },
        twoFactorEnabled: {
          type: Sequelize.TINYINT(1),
          allowNull: true,
          defaultValue: 0,
        },
        // Riêng tư
        requireCommentApproval: {
          type: Sequelize.TINYINT(1),
          allowNull: true,
          defaultValue: 0,
        },
        allowDirectMessages: {
          type: Sequelize.STRING(100),
          allowNull: true,
          defaultValue: "everyone",
        },
        allowComments: {
          type: Sequelize.TINYINT(1),
          allowNull: true,
          defaultValue: 1,
        },
        searchEngineIndexing: {
          type: Sequelize.TINYINT(1),
          allowNull: true,
          defaultValue: 1,
        },
        showViewCounts: {
          type: Sequelize.TINYINT(1),
          allowNull: true,
          defaultValue: 1,
        },
        showEmail: {
          type: Sequelize.TINYINT(1),
          allowNull: true,
          defaultValue: 1,
        },

        // Thông báo
        emailNewLikes: {
          type: Sequelize.TINYINT(1),
          allowNull: true,
          defaultValue: 1,
        },
        emailNewComments: {
          type: Sequelize.TINYINT(1),
          allowNull: true,
          defaultValue: 1,
        },
        emailNewFollowers: {
          type: Sequelize.TINYINT(1),
          allowNull: true,
          defaultValue: 1,
        },
        emailWeeklyDigest: {
          type: Sequelize.TINYINT(1),
          allowNull: true,
          defaultValue: 1,
        },
        pushNotifications: {
          type: Sequelize.TINYINT(1),
          allowNull: true,
          defaultValue: 1,
        },
        // Timestamp
        created_at: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
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
      },
      {
        timestamps: true,
        charset: "utf8",
        collate: "utf8_general_ci",
        engine: "InnoDB",
      }
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("user_settings");
  },
};
