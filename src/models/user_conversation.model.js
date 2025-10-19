module.exports = (sequelize, DataTypes) => {
  const UserConversation = sequelize.define(
    'UserConversation',
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
      status: {
        type: DataTypes.ENUM('pending', 'accepted', 'blocked'),
      },
      requesterId: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
        field: 'requester_id',
      },
    },
    {
      tableName: 'user_conversations',
      timestamps: true,
      underscored: true,
      paranoid: true,
      charset: 'utf8',
      collate: 'utf8_general_ci',
      engine: 'InnoDB',
      createdAt: 'createdAt',
      updatedAt: 'updatedAt',
      deletedAt: 'deletedAt',
    }
  );
  UserConversation.associate = (db) => {
    UserConversation.belongsTo(db.User, {
      foreignKey: 'userId',
      as: 'user',
    });
    UserConversation.belongsTo(db.Conversation, {
      foreignKey: 'conversationId',
      as: 'conversation',
    });
    UserConversation.hasMany(db.MessageSystem, {
      foreignKey: 'conversationId',
      as: 'systemMessageThread',
    });
  };
  return UserConversation;
};
