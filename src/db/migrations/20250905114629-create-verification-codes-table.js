'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('verification_codes', {
      id: {
        type: Sequelize.BIGINT.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      user_id: {
        type: Sequelize.BIGINT.UNSIGNED,
        references: {
          model: 'users',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      target: {
        type: Sequelize.STRING(255),
      },
      code: {
        type: Sequelize.STRING(10),
      },
      action: {
        type: Sequelize.STRING(50),
      },
      expires_at: {
        type: Sequelize.DATE,
      },
      used_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      created_at: {
        type: Sequelize.DATE(6),
      },
      updated_at: {
        type: Sequelize.DATE(6),
      },
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('verification_codes');
  },
};
