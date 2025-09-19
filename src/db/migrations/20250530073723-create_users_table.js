'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('users', {
      id: {
        type: Sequelize.BIGINT.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      username: {
        type: Sequelize.STRING(100),
        unique: true,
      },
      email: {
        type: Sequelize.STRING(100),
        unique: true,
      },
      phone: {
        type: Sequelize.STRING(20),
        unique: true,
      },
      password: {
        type: Sequelize.STRING(255),
      },
      name: {
        type: Sequelize.STRING(191),
      },
      first_name: {
        type: Sequelize.STRING(100),
      },
      last_name: {
        type: Sequelize.STRING(100),
      },
      avatar: {
        type: Sequelize.STRING(191),
      },
      bio: {
        type: Sequelize.TEXT,
      },
      post_count: {
        type: Sequelize.BIGINT.UNSIGNED,
      },
      follower_count: {
        type: Sequelize.BIGINT.UNSIGNED,
      },
      following_count: {
        type: Sequelize.BIGINT.UNSIGNED,
      },
      like_count: {
        type: Sequelize.BIGINT.UNSIGNED,
      },
      report_count: {
        type: Sequelize.BIGINT.UNSIGNED,
      },
      gender: {
        type: Sequelize.ENUM('male', 'female', 'other'),
      },
      birthday: {
        type: Sequelize.DATEONLY,
      },
      role: {
        type: Sequelize.STRING(100),
      },
      status: {
        type: Sequelize.ENUM('active', 'inactive', 'banned'),
      },
      two_factor_enabled: {
        type: Sequelize.BOOLEAN,
      },
      login_provider: {
        type: Sequelize.STRING(100),
      },
      last_login_at: {
        type: Sequelize.DATE(6),
      },
      email_sent_at: {
        type: Sequelize.DATE(6),
      },
      verified_at: {
        type: Sequelize.DATE(6),
      },
      created_at: {
        type: Sequelize.DATE(6),
      },
      updated_at: {
        type: Sequelize.DATE(6),
        onUpdate: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      deleted_at: {
        type: Sequelize.DATE(6),
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('users');
  },
};
