'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('friends', {
      id: {
        type: Sequelize.BIGINT.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
      },
      user_id: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      friend_id: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      status: {
        type: Sequelize.ENUM('pending', 'accepted', 'blocked'),
        defaultValue: 'pending',
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updated_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal(
          'CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'
        ),
      },
    });

    // 🔒 Thêm unique constraint cho cặp user_id - friend_id
    await queryInterface.addConstraint('friends', {
      fields: ['user_id', 'friend_id'],
      type: 'unique',
      name: 'unique_friend_pair',
    });

    // ⚡ Tùy chọn: thêm index để tối ưu truy vấn
    await queryInterface.addIndex('friends', ['user_id']);
    await queryInterface.addIndex('friends', ['friend_id']);
  },

  async down(queryInterface, Sequelize) {
    // Gỡ constraint và index trước khi drop table để tránh lỗi rollback
    await queryInterface.removeConstraint('friends', 'unique_friend_pair');
    await queryInterface.removeIndex('friends', ['user_id']);
    await queryInterface.removeIndex('friends', ['friend_id']);

    await queryInterface.dropTable('friends');
  },
};
