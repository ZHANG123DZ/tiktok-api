'use strict';

/** @type {import('sequelize-cli').Migration} */

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable(
      'posts',
      {
        id: {
          type: Sequelize.BIGINT.UNSIGNED,
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
        },

        title: {
          type: Sequelize.STRING(191),
          allowNull: true,
          defaultValue: '',
        },
        slug: {
          type: Sequelize.STRING(191),
          allowNull: true,
          unique: true,
        },
        content: {
          type: Sequelize.TEXT,
          allowNull: true,
        },
        description: {
          type: Sequelize.TEXT,
          allowNull: true,
        },

        author_id: {
          type: Sequelize.BIGINT.UNSIGNED,
          allowNull: false,
          references: {
            model: 'users',
            key: 'id',
          },
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE',
        },
        author_name: {
          type: Sequelize.STRING(191),
          allowNull: true,
        },
        meta_title: {
          type: Sequelize.STRING(191),
          allowNull: true,
          defaultValue: '',
        },
        meta_description: {
          type: Sequelize.STRING(191),
          allowNull: false,
          defaultValue: '',
        },
        status: {
          type: Sequelize.STRING(50),
          defaultValue: 'draft',
          allowNull: true,
        },
        views_count: {
          type: Sequelize.BIGINT.UNSIGNED,
          allowNull: true,
          defaultValue: 0,
        },
        likes_count: {
          type: Sequelize.BIGINT.UNSIGNED,
          allowNull: true,
          defaultValue: 0,
        },
        comments_count: {
          type: Sequelize.BIGINT.UNSIGNED,
          allowNull: true,
          defaultValue: 0,
        },
        reports_count: {
          type: Sequelize.BIGINT.UNSIGNED,
          allowNull: true,
          defaultValue: 0,
        },

        language: {
          type: Sequelize.STRING(191),
          allowNull: true,
        },
        visibility: {
          type: Sequelize.ENUM('public', 'private', 'unlisted'),
          allowNull: false,
          defaultValue: 'public',
        },
        moderation_status: {
          type: Sequelize.ENUM('approved', 'pending', 'rejected'),
          allowNull: false,
          defaultValue: 'approved',
        },
        cover_url: {
          type: Sequelize.STRING(255),
          allowNull: true,
        },
        thumbnail_url: {
          type: Sequelize.STRING(255),
          allowNull: true,
        },
        reading_time: {
          type: Sequelize.INTEGER.UNSIGNED,
          allowNull: true,
          defaultValue: 0,
        },

        is_pinned: {
          type: Sequelize.TINYINT(1).UNSIGNED,
          allowNull: false,
          defaultValue: 0,
        },
        is_featured: {
          type: Sequelize.TINYINT(1).UNSIGNED,
          allowNull: false,
          defaultValue: 0,
        },
        has_media: {
          type: Sequelize.TINYINT(1).UNSIGNED,
          allowNull: false,
          defaultValue: 0,
        },
        visibility_updated_at: {
          type: Sequelize.DATE(6),
          allowNull: true,
        },
        published_at: {
          type: Sequelize.DATE(6),
          allowNull: false,
          defaultValue: Sequelize.literal('CURRENT_TIMESTAMP(6)'),
        },
        created_at: {
          type: Sequelize.DATE(6),
          allowNull: false,
          defaultValue: Sequelize.literal('CURRENT_TIMESTAMP(6)'),
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

    // Indexes
    await queryInterface.addIndex('posts', ['author_id']);
    await queryInterface.addIndex('posts', ['visibility']);
    await queryInterface.addIndex('posts', ['created_at']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('posts');
  },
};
