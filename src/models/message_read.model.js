module.exports = (sequelize, DataTypes) => {
  const MessageRead = sequelize.define(
    'MessageRead',
    {
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
      conversationId: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
        references: {
          model: 'conversations',
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
        field: 'conversation_id',
      },
      messageId: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
        references: {
          model: 'messages',
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
        field: 'message_id',
      },
      readAt: {
        type: DataTypes.DATE,
        allowNull: false,
        field: 'read_at',
      },
    },
    {
      tableName: 'message_reads',
      timestamps: true,
      underscored: true,
      charset: 'utf8',
      collate: 'utf8_general_ci',
      engine: 'InnoDB',
      createdAt: 'createdAt',
      updatedAt: 'updatedAt',
    }
  );

  MessageRead.associate = (db) => {
    MessageRead.belongsTo(db.User, {
      foreignKey: 'userId',
      as: 'user',
    });

    MessageRead.belongsTo(db.Conversation, {
      foreignKey: 'conversationId',
      as: 'conversation',
    });

    MessageRead.belongsTo(db.Message, {
      foreignKey: 'messageId',
      as: 'message',
    });
  };

  return MessageRead;
};
