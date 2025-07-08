'use strict';

/** @type {import('sequelize-cli').Migration} */

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable(
      'email_verifications',
      {
        id: {
          type: Sequelize.BIGINT.UNSIGNED,
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
        },
        email: {
          type: Sequelize.STRING(255),
          allowNull: false,
        },
        otp_code: {
          type: Sequelize.STRING(6),
          allowNull: false,
        },
        expired_at: {
          type: Sequelize.DATE,
          allowNull: true,
        },
        verified_at: {
          type: Sequelize.DATE,
          allowNull: true,
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
    await queryInterface.dropTable('email_verifications');
  },
};
