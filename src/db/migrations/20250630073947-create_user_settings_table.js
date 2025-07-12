'use strict';

/** @type {import('sequelize-cli').Migration} */

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable(
      'user_settings',
      {
        user_id: {
          type: Sequelize.BIGINT.UNSIGNED,
          allowNull: false,
          primaryKey: true,
          references: {
            model: 'users',
            key: 'id',
          },
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE',
        },

        // Giao diện
        theme: {
          type: Sequelize.ENUM('dark', 'light'),
          allowNull: false,
          defaultValue: 'dark',
        },
        language: {
          type: Sequelize.STRING(100),
          allowNull: false,
          defaultValue: 'english',
        },

        // Riêng tư
        is_private: {
          type: Sequelize.TINYINT(1),
          allowNull: false,
          defaultValue: 0,
        },
        muted: {
          type: Sequelize.TINYINT(1),
          allowNull: false,
          defaultValue: 1,
        },

        // Quyền chia sẻ video
        allow_comments: {
          type: Sequelize.TINYINT(1),
          allowNull: false,
          defaultValue: 1,
        },
        allow_downloads: {
          type: Sequelize.TINYINT(1),
          allowNull: false,
          defaultValue: 1,
        },
        allow_duet: {
          type: Sequelize.TINYINT(1),
          allowNull: false,
          defaultValue: 1,
        },
        allow_stitch: {
          type: Sequelize.TINYINT(1),
          allowNull: false,
          defaultValue: 1,
        },

        // Thông báo
        notify_likes: {
          type: Sequelize.TINYINT(1),
          allowNull: false,
          defaultValue: 1,
        },
        notify_comments: {
          type: Sequelize.TINYINT(1),
          allowNull: false,
          defaultValue: 1,
        },
        notify_new_followers: {
          type: Sequelize.TINYINT(1),
          allowNull: false,
          defaultValue: 1,
        },

        // Timestamp
        created_at: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        },
        updated_at: {
          type: Sequelize.DATE(6),
          allowNull: false,
          defaultValue: Sequelize.literal('CURRENT_TIMESTAMP(6)'),
          onUpdate: Sequelize.literal('CURRENT_TIMESTAMP(6)'),
        },
        deleted_at: {
          type: Sequelize.DATE(6),
          allowNull: true,
        },
      },
      {
        timestamps: true,
        underscored: true,
        charset: 'utf8',
        collate: 'utf8_general_ci',
        engine: 'InnoDB',
      }
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('user_settings');
  },
};
