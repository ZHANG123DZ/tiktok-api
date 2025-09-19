'use strict';

/** @type {import('sequelize-cli').Migration} */

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable(
      'message_reads',
      {
        id: {
          type: Sequelize.BIGINT.UNSIGNED,
          primaryKey: true,
          autoIncrement: true,
        },
        user_id: {
          type: Sequelize.BIGINT.UNSIGNED,
          references: {
            model: 'users',
            key: 'id',
          },
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE',
        },
        conversation_id: {
          type: Sequelize.BIGINT.UNSIGNED,
          references: {
            model: 'conversations',
            key: 'id',
          },
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE',
        },
        message_id: {
          type: Sequelize.BIGINT.UNSIGNED,
          references: {
            model: 'messages',
            key: 'id',
          },
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE',
        },
        read_at: {
          type: Sequelize.DATE,
        },
        created_at: {
          type: Sequelize.DATE,
        },
        updated_at: {
          type: Sequelize.DATE,
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

    await queryInterface.addIndex('message_reads', [
      'user_id',
      'conversation_id',
    ]);
    await queryInterface.addIndex('message_reads', ['message_id']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('message_reads');
  },
};
