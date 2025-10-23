'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('reposts', {
      id: {
        type: Sequelize.BIGINT.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      user_id: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      post_id: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: false,
        references: {
          model: 'posts',
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      created_at: {
        type: Sequelize.DATE(6),
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP(6)'),
      },
      updated_at: {
        type: Sequelize.DATE(6),
        allowNull: false,
        defaultValue: Sequelize.literal(
          'CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)'
        ),
      },
    });

    // ✅ Unique constraint để tránh repost trùng
    await queryInterface.addConstraint('reposts', {
      fields: ['user_id', 'post_id'],
      type: 'unique',
      name: 'unique_user_post_repost',
    });

    // ✅ Index tối ưu truy vấn
    await queryInterface.addIndex('reposts', ['user_id']);
    await queryInterface.addIndex('reposts', ['post_id']);
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('reposts');
  },
};
