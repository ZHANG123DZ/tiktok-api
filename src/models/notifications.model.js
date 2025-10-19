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
      actorId: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: true,
        references: {
          model: 'users',
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
        field: 'actor_id',
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
      foreignKey: 'userId',
      as: 'user',
    });
    Notification.belongsTo(db.User, {
      foreignKey: 'actorId',
      as: 'actor',
    });
    Notification.belongsTo(db.User, {
      foreignKey: 'notifiableId',
      as: 'follower',
      constraints: false,
    });
    Notification.belongsTo(db.Post, {
      foreignKey: 'notifiableId',
      as: 'post',
      constraints: false,
    });
    Notification.belongsTo(db.Comment, {
      foreignKey: 'notifiableId',
      as: 'comment',
      constraints: false,
    });
  };
  return Notification;
};
