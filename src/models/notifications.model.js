"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = (sequelize, DataTypes) => {
  const Notification = sequelize.define(
    "Notification",
    {
      type: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      user_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      notifiable_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
      },
      notifiable_type: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      read_at: {
        type: DataTypes.DATE(6),
        allowNull: true,
      },
    },
    {
      tableName: "notifications",
      timestamps: true,
      underscored: true,
      charset: "utf8",
      collate: "utf8_general_ci",
      engine: "InnoDB",
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );
  Notification.associate = (db) => {
    Notification.belongsTo(db.User, {
      foreignKey: "user_id",
      as: "user",
    });
    Notification.belongsTo(db.User, {
      foreignKey: "notifiable_id",
      as: "follower",
      constraints: false,
    });
    Notification.belongsTo(db.Post, {
      foreignKey: "notifiable_id",
      as: "post",
      constraints: false,
    });
    Notification.belongsTo(db.Comment, {
      foreignKey: "notifiable_id",
      as: "comment",
      constraints: false,
    });
  };
  return Notification;
};
