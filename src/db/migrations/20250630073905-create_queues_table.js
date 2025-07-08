'use strict';

/** @type {import('sequelize-cli').Migration} */

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable(
      'queues',
      {
        id: {
          type: Sequelize.BIGINT.UNSIGNED,
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
        },
        type: {
          type: Sequelize.STRING(100),
          allowNull: false,
        },
        status: {
          type: Sequelize.STRING(100),
          allowNull: false,
          defaultValue: 'pending',
        },
        payload: {
          type: Sequelize.TEXT,
          allowNull: false,
        },
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
    await queryInterface.dropTable('queues');
  },
};
