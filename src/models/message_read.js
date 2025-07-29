module.exports = (sequelize, DataTypes) => {
  const MessageRead = sequelize.define(
    "MessageRead",
    {
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
      conversation_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
        references: {
          model: "conversations",
          key: "id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      message_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
        references: {
          model: "messages",
          key: "id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      read_at: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    {
      tableName: "message_reads",
      timestamps: true,
      underscored: true,
      charset: "utf8",
      collate: "utf8_general_ci",
      engine: "InnoDB",
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );

  MessageRead.associate = (db) => {
    MessageRead.belongsTo(db.User, {
      foreignKey: "user_id",
      as: "user",
    });

    MessageRead.belongsTo(db.Conversation, {
      foreignKey: "conversation_id",
      as: "conversation",
    });

    MessageRead.belongsTo(db.Message, {
      foreignKey: "message_id",
      as: "message",
    });
  };

  return MessageRead;
};
