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
    await queryInterface.createTable(
      "users",
      {
        id: {
          type: Sequelize.BIGINT.UNSIGNED,
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
        },
        username: {
          type: Sequelize.STRING(100),
          allowNull: false,
          unique: true,
        },
        email: {
          type: Sequelize.STRING(100),
          allowNull: true,
          unique: true,
        },
        phone: {
          type: Sequelize.STRING(20),
          allowNull: true,
          unique: true,
        },
        password: {
          type: Sequelize.STRING(255),
          allowNull: true,
          defaultValue: null,
        },
        full_name: {
          type: Sequelize.STRING(191),
          allowNull: true,
        },
        first_name: {
          type: Sequelize.STRING(100),
          allowNull: true,
        },
        last_name: {
          type: Sequelize.STRING(100),
          allowNull: true,
        },
        avatar_url: {
          type: Sequelize.STRING(191),
          allowNull: true,
        },
        bio: {
          type: Sequelize.TEXT,
          allowNull: true,
        },
        followers_count: {
          type: Sequelize.BIGINT,
          defaultValue: 0,
          allowNull: true,
        },
        following_count: {
          type: Sequelize.BIGINT,
          defaultValue: 0,
          allowNull: true,
        },
        likes_count: {
          type: Sequelize.BIGINT,
          defaultValue: 0,
          allowNull: true,
        },
        gender: {
          type: Sequelize.ENUM("male", "female", "other"),
          allowNull: true,
        },
        birthday: {
          type: Sequelize.DATEONLY,
          allowNull: true,
        },
        role: {
          type: Sequelize.ENUM("user", "admin"),
          allowNull: true,
        },
        status: {
          type: Sequelize.ENUM("active", "inactive", "banned"),
          allowNull: true,
          defaultValue: "active",
        },
        cover_url: {
          type: Sequelize.STRING(255),
          allowNull: true,
        },
        location: {
          type: Sequelize.STRING(100),
          allowNull: true,
        },
        two_factor_enabled: {
          type: Sequelize.BOOLEAN,
          defaultValue: 0,
        },
        login_provider: {
          type: Sequelize.STRING(100),
          allowNull: true,
        },
        last_login_at: {
          type: Sequelize.DATE(6),
          allowNull: true,
        },
        verified_at: {
          type: Sequelize.DATE(6),
          allowNull: true,
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
          onUpdate: Sequelize.literal("CURRENT_TIMESTAMP"),
        },
        deleted_at: {
          type: Sequelize.DATE(6),
          allowNull: true,
        },
      },
      {
        timestamps: true,
        underscored: true,
        charset: "utf8",
        collate: "utf8_general_ci",
        engine: "InnoDB",
        timestamps: false,
      }
    );
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.dropTable("users");
  },
};
