'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('shares', {
      id: {
        type: Sequelize.BIGINT.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      title: {
        type: Sequelize.STRING(100),
      },
      description: {
        type: Sequelize.TEXT,
      },
      type: {
        type: Sequelize.TEXT,
      },
      target_id: {
        type: Sequelize.BIGINT.UNSIGNED,
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
      created_at: {
        type: Sequelize.DATE(6),
      },
      updated_at: {
        type: Sequelize.DATE(6),
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('shares');
  },
};
