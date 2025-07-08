'use strict';

/** @type {import('sequelize-cli').Migration} */

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('media_files', {
      id: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
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
      type: {
        type: Sequelize.ENUM('image', 'video', 'audio'),
        allowNull: true,
      },
      mime_type: {
        type: Sequelize.STRING(191),
        allowNull: true,
      },
      url: {
        type: Sequelize.STRING(191),
        allowNull: false,
      },
      alt_text: {
        type: Sequelize.STRING(191),
        allowNull: true,
      },
      caption: {
        type: Sequelize.STRING(191),
        allowNull: true,
      },
      position: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: true,
      },
      duration: {
        type: Sequelize.FLOAT.UNSIGNED,
        allowNull: true,
      },
      size: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: true,
      },
      width: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: true,
      },
      height: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: true,
      },
      created_at: {
        type: Sequelize.DATE(6),
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP(6)'),
      },
      updated_at: {
        type: Sequelize.DATE(6),
        allowNull: true,
      },
    });

    await queryInterface.addIndex('media_files', ['post_id']);
    await queryInterface.addIndex('media_files', ['post_id', 'position']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('media_files');
  },
};
