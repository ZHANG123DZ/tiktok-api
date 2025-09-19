module.exports = (sequelize, DataTypes) => {
  const MessageSystem = sequelize.define(
    'MessageSystem',
    {
      user_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      conversation_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
        references: {
          model: 'conversations',
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      parent_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: true,
        references: {
          model: 'messages',
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
        defaultValue: null,
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
      foreignKey: 'user_id',
      as: 'sender',
    });

    MessageSystem.belongsTo(db.Conversation, {
      foreignKey: 'conversation_id',
      as: 'conversation',
    });
    MessageSystem.hasMany(db.MessageRead, {
      foreignKey: 'message_id',
      as: 'reads',
    });
  };
  return MessageSystem;
};
