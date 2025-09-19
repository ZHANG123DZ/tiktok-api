'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = (sequelize, DataTypes) => {
  const Notification = sequelize.define(
    'Notification',
    {
      type: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      userId: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
        field: 'user_id',
      },
      notifiableId: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
        field: 'notifiable_id',
      },
      notifiableType: {
        type: DataTypes.TEXT,
        allowNull: false,
        field: 'notifiable_type',
      },
      readAt: {
        type: DataTypes.DATE(6),
        allowNull: true,
        field: 'read_at',
      },
    },
    {
      tableName: 'notifications',
      timestamps: true,
      underscored: true,
      charset: 'utf8',
      collate: 'utf8_general_ci',
      engine: 'InnoDB',
      createdAt: 'createdAt',
      updatedAt: 'updatedAt',
    }
  );
  Notification.associate = (db) => {
    Notification.belongsTo(db.User, {
      foreignKey: 'user_id',
      as: 'user',
    });
    Notification.belongsTo(db.User, {
      foreignKey: 'notifiable_id',
      as: 'follower',
      constraints: false,
    });
    Notification.belongsTo(db.Post, {
      foreignKey: 'notifiable_id',
      as: 'post',
      constraints: false,
    });
    Notification.belongsTo(db.Comment, {
      foreignKey: 'notifiable_id',
      as: 'comment',
      constraints: false,
    });
  };
  return Notification;
};
