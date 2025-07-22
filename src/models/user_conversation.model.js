module.exports = (sequelize, DataTypes) => {
  const UserConversation = sequelize.define(
    "UserConversation",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
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
    },
    {
      tableName: "user_conversations",
      timestamps: true,
      underscored: true,
      charset: "utf8",
      collate: "utf8_general_ci",
      engine: "InnoDB",
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );
  UserConversation.associate = (db) => {
    UserConversation.belongsTo(db.User, {
      foreignKey: "user_id",
      as: "user",
    });
    UserConversation.belongsTo(db.Conversation, {
      foreignKey: "conversation_id",
      as: "conversation",
    });
  };
  return UserConversation;
};
