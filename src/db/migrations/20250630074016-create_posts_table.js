'use strict';

/** @type {import('sequelize-cli').Migration} */

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('posts', {
      id: {
        type: Sequelize.BIGINT.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      title: {
        type: Sequelize.STRING(191),
      },
      slug: {
        type: Sequelize.STRING(191),
        unique: true,
      },
      thumbnail: {
        type: Sequelize.STRING(255),
      },
      content: {
        type: Sequelize.TEXT,
      },
      type: {
        type: Sequelize.STRING(50),
      },
      description: {
        type: Sequelize.TEXT,
      },
      music_id: {
        type: Sequelize.BIGINT.UNSIGNED,
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
        references: {
          model: 'musics',
          key: 'id',
        },
      },
      //author
      author_id: {
        type: Sequelize.BIGINT.UNSIGNED,
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
        references: {
          model: 'users',
          key: 'id',
        },
      },
      author_name: {
        type: Sequelize.STRING(191),
      },
      author_username: {
        type: Sequelize.STRING(191),
      },
      author_avatar: {
        type: Sequelize.STRING(191),
      },

      status: {
        type: Sequelize.STRING(50),
      },
      view_count: {
        type: Sequelize.BIGINT.UNSIGNED,
      },
      like_count: {
        type: Sequelize.BIGINT.UNSIGNED,
      },
      comment_count: {
        type: Sequelize.BIGINT.UNSIGNED,
      },
      book_mark_count: {
        type: Sequelize.BIGINT.UNSIGNED,
      },
      share_count: {
        type: Sequelize.BIGINT.UNSIGNED,
      },
      repost_count: {
        type: Sequelize.BIGINT.UNSIGNED,
      },
      report_count: {
        type: Sequelize.BIGINT.UNSIGNED,
      },
      digg_count: {
        type: Sequelize.BIGINT.UNSIGNED,
      },
      //SEO
      meta_title: {
        type: Sequelize.STRING(191),
      },
      meta_description: {
        type: Sequelize.STRING(191),
      },
      language: {
        type: Sequelize.STRING(191),
      },
      visibility: {
        type: Sequelize.ENUM('public', 'private', 'unlisted'),
      },
      moderation_status: {
        type: Sequelize.ENUM('approved', 'pending', 'rejected'),
      },
      is_pinned: {
        type: Sequelize.TINYINT(1).UNSIGNED,
      },
      is_featured: {
        type: Sequelize.TINYINT(1).UNSIGNED,
      },
      visibility_updated_at: {
        type: Sequelize.DATE(6),
      },
      published_at: {
        type: Sequelize.DATE(6),
      },
      created_at: {
        type: Sequelize.DATE(6),
      },
      updated_at: {
        type: Sequelize.DATE(6),
        onUpdate: Sequelize.literal('CURRENT_TIMESTAMP(6)'),
      },
      deleted_at: {
        type: Sequelize.DATE(6),
      },
    });

    // Indexes
    await queryInterface.addIndex('posts', ['author_id']);
    await queryInterface.addIndex('posts', ['visibility']);
    await queryInterface.addIndex('posts', ['created_at']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('posts');
  },
};
