'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('permissions', {
      id: {
        type: Sequelize.BIGINT.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: Sequelize.STRING(100),
      },
      code: {
        type: Sequelize.STRING(100),
      },
      description: {
        type: Sequelize.STRING(255),
      },
      created_at: {
        type: Sequelize.DATE(6),
      },
      updated_at: {
        type: Sequelize.DATE(6),
      },
      deleted_at: {
        type: Sequelize.DATE(6),
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('permissions');
  },
};
