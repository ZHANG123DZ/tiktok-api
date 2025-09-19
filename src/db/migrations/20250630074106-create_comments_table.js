'use strict';

/** @type {import('sequelize-cli').Migration} */

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable(
      'comments',
      {
        id: {
          type: Sequelize.BIGINT.UNSIGNED,
          autoIncrement: true,
          primaryKey: true,
        },

        post_id: {
          type: Sequelize.BIGINT.UNSIGNED,
          references: {
            model: 'posts',
            key: 'id',
          },
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE',
        },

        author_id: {
          type: Sequelize.BIGINT.UNSIGNED,
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE',
          references: {
            model: 'users',
            key: 'id',
          },
        },

        content: {
          type: Sequelize.TEXT,
        },

        parent_id: {
          type: Sequelize.BIGINT.UNSIGNED,
          references: {
            model: 'comments',
            key: 'id',
          },
          onDelete: 'SET NULL',
          onUpdate: 'CASCADE',
        },
        like_count: {
          type: Sequelize.BIGINT.UNSIGNED,
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
      },
      {
        timestamps: true,
        underscored: true,
        charset: 'utf8',
        collate: 'utf8_general_ci',
        engine: 'InnoDB',
      }
    );

    await queryInterface.addIndex('comments', ['post_id'], {
      name: 'idx_comments_post_id',
    });
    await queryInterface.addIndex('comments', ['author_id'], {
      name: 'idx_comments_author_id',
    });
    await queryInterface.addIndex('comments', ['parent_id'], {
      name: 'idx_comments_parent_id',
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('comments');
  },
};
