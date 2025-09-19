'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('role_permissions', {
      id: {
        type: Sequelize.BIGINT.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      role_id: {
        type: Sequelize.BIGINT.UNSIGNED,
        references: {
          model: 'roles',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      permission_id: {
        type: Sequelize.BIGINT.UNSIGNED,
        references: {
          model: 'permissions',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
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
    await queryInterface.dropTable('role_permissions');
  },
};
