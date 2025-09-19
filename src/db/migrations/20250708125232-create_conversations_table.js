'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    queryInterface.createTable('conversations', {
      id: {
        type: Sequelize.BIGINT.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      avatar: {
        type: Sequelize.STRING(255),
      },
      name: {
        type: Sequelize.STRING(255),
      },
      is_group: {
        type: Sequelize.BOOLEAN,
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
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.dropTable('conversations');
  },
};
