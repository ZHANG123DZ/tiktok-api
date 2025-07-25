module.exports = (sequelize, DataTypes) => {
  const Conversation = sequelize.define(
    "Conversation",
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
      avatar_url: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      deleted_at: {
        type: DataTypes.DATE(6),
        allowNull: true,
      },
    },
    {
      tableName: "conversations",
      timestamps: true,
      underscored: true,
      charset: "utf8",
      collate: "utf8_general_ci",
      engine: "InnoDB",
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );
  Conversation.associate = (db) => {
    Conversation.belongsToMany(db.User, {
      through: db.UserConversation,
      foreignKey: "user_id",
      as: "creator",
    });
    Conversation.hasMany(db.UserConversation, {
      foreignKey: "conversation_id",
      as: "participants",
    });
    Conversation.hasMany(db.Message, {
      foreignKey: "conversation_id",
      as: "messages",
    });
  };
  return Conversation;
};
