'use strict';

/** @type {import('sequelize-cli').Migration} */

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable(
      'user_settings',
      {
        user_id: {
          type: Sequelize.BIGINT.UNSIGNED,
          primaryKey: true,
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE',
          references: {
            model: 'users',
            key: 'id',
          },
        },

        // Giao diện
        theme: {
          type: Sequelize.ENUM('dark', 'light'),
        },
        location: {
          type: Sequelize.STRING(100),
        },
        language: {
          type: Sequelize.STRING(100),
        },
        profile_visibility: {
          type: Sequelize.ENUM('public', 'followers', 'private'),
        },

        post_visibility: {
          type: Sequelize.ENUM('public', 'private', 'draft'),
        },
        require_comment_approval: {
          type: Sequelize.TINYINT(1),
        },
        two_factor_enabled: {
          type: Sequelize.TINYINT(1),
        },
        // Riêng tư
        allow_direct_messages: {
          type: Sequelize.STRING(100),
        },
        allow_comments: {
          type: Sequelize.TINYINT(1),
        },
        search_engine_indexing: {
          type: Sequelize.TINYINT(1),
        },
        show_view_counts: {
          type: Sequelize.TINYINT(1),
        },
        show_email: {
          type: Sequelize.TINYINT(1),
        },

        // Thông báo
        email_new_likes: {
          type: Sequelize.TINYINT(1),
        },
        email_new_comments: {
          type: Sequelize.TINYINT(1),
        },
        email_new_followers: {
          type: Sequelize.TINYINT(1),
        },
        email_weekly_digest: {
          type: Sequelize.TINYINT(1),
        },
        push_notifications: {
          type: Sequelize.TINYINT(1),
        },
        // Timestamp
        created_at: {
          type: Sequelize.DATE,
        },
        updated_at: {
          type: Sequelize.DATE(6),
          onUpdate: Sequelize.literal('CURRENT_TIMESTAMP(6)'),
        },
        deleted_at: {
          type: Sequelize.DATE(6),
        },
      },
      {
        timestamps: true,
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
