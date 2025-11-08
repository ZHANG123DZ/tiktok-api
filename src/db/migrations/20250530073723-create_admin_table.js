'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      'admin',
      {
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
        gender: {
          type: Sequelize.ENUM('male', 'female', 'other'),
        },
        role: {
          type: Sequelize.STRING(100),
        },
        status: {
          type: Sequelize.ENUM('active', 'inactive', 'banned'),
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
      },
      {
        charset: 'utf8mb4', // ✅ hỗ trợ emoji
        collate: 'utf8mb4_unicode_ci', // ✅ sắp xếp đúng chuẩn Unicode
        timestamps: false, // hoặc true nếu bạn muốn Sequelize tự quản lý createdAt/updatedAt
      }
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('admin');
  },
};
