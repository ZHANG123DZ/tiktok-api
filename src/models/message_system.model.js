module.exports = (sequelize, DataTypes) => {
  const MessageSystem = sequelize.define(
    'MessageSystem',
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
      parentId: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: true,
        references: {
          model: 'messages',
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
        defaultValue: null,
        field: 'parent_id',
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      reactions: {
        type: DataTypes.JSON,
        allowNull: true,
      },
    },
    {
      tableName: 'messages',
      timestamps: true,
      paranoid: true,
      underscored: true,
      charset: 'utf8',
      collate: 'utf8_general_ci',
      engine: 'InnoDB',
      createdAt: 'createdAt',
      updatedAt: 'updatedAt',
      deletedAt: 'deletedAt',
    }
  );
  MessageSystem.associate = (db) => {
    MessageSystem.belongsTo(db.User, {
      foreignKey: 'userId',
      as: 'sender',
    });

    MessageSystem.belongsTo(db.Conversation, {
      foreignKey: 'conversationId',
      as: 'conversation',
    });
    MessageSystem.hasMany(db.MessageRead, {
      foreignKey: 'messageId',
      as: 'reads',
    });
  };
  return MessageSystem;
};
