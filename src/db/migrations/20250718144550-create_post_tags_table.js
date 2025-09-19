'use strict';

/** @type {import('sequelize-cli').Migration} */

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable(
      'post_tags',
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
        tag_id: {
          type: Sequelize.BIGINT.UNSIGNED,
          references: {
            model: 'tags',
            key: 'id',
          },
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE',
        },
        created_at: {
          type: Sequelize.DATE(6),
        },
        updated_at: {
          type: Sequelize.DATE(6),
          onUpdate: Sequelize.literal('CURRENT_TIMESTAMP(6)'),
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
    await queryInterface.dropTable('post_tags');
  },
};
