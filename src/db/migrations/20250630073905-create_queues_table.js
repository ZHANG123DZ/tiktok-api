'use strict';

/** @type {import('sequelize-cli').Migration} */

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable(
      'queues',
      {
        id: {
          type: Sequelize.BIGINT.UNSIGNED,
          autoIncrement: true,
          primaryKey: true,
        },
        type: {
          type: Sequelize.STRING(100),
        },
        status: {
          type: Sequelize.STRING(100),
        },
        payload: {
          type: Sequelize.TEXT,
        },
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
        underscored: true,
        charset: 'utf8',
        collate: 'utf8_general_ci',
        engine: 'InnoDB',
      }
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('queues');
  },
};
