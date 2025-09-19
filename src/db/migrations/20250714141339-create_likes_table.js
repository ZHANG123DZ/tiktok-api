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
    await queryInterface.createTable('likes', {
      id: {
        type: Sequelize.BIGINT.UNSIGNED,

        autoIncrement: true,
        primaryKey: true,
      },
      user_id: {
        type: Sequelize.BIGINT.UNSIGNED,
      },
      like_able_id: {
        type: Sequelize.BIGINT.UNSIGNED,
      },
      like_able_type: {
        type: Sequelize.TEXT,
      },
      created_at: {
        type: Sequelize.DATE(6),
      },
      updated_at: {
        type: Sequelize.DATE(6),

        onUpdate: Sequelize.literal('CURRENT_TIMESTAMP(6)'),
      },
    });

    await queryInterface.addIndex(
      'likes',
      ['user_id', 'like_able_id', 'like_able_type'],
      {
        unique: true,
        name: 'unique_like_user_target',
      }
    );
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.dropTable('likes');
  },
};
