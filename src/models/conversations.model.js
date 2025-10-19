module.exports = (sequelize, DataTypes) => {
  const Conversation = sequelize.define(
    'Conversation',
    {
      avatar: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      name: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      isGroup: {
        type: DataTypes.BOOLEAN,
        defaultValue: 0,
        field: 'is_group',
      },
    },
    {
      tableName: 'conversations',
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
  Conversation.associate = (db) => {
    Conversation.belongsToMany(db.User, {
      through: db.UserConversation,
      foreignKey: 'conversationId',
      as: 'users',
    });
    Conversation.hasMany(db.UserConversation, {
      foreignKey: 'conversationId',
      as: 'participants',
    });
    Conversation.hasMany(db.Message, {
      foreignKey: 'conversationId',
      as: 'messages',
    });
    Conversation.hasMany(db.MessageRead, {
      foreignKey: 'conversationId',
      as: 'listReader',
    });
  };
  return Conversation;
};
