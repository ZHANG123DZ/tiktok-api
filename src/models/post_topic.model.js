module.exports = (sequelize, DataTypes) => {
  const PostTopic = sequelize.define(
    "PostTopic",
    {
      post_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
        references: {
          model: "posts",
          key: "id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      topic_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
        references: {
          model: "topics",
          key: "id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
    },
    {
      tableName: "post_topics",
      timestamps: true,
      underscored: true,
      charset: "utf8",
      collate: "utf8_general_ci",
      engine: "InnoDB",
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );
  PostTopic.associate = (db) => {
    PostTopic.belongsTo(db.Post, {
      foreignKey: "post_id",
      as: "post",
    });
    PostTopic.belongsTo(db.Topic, {
      foreignKey: "topic_id",
      as: "topic",
    });
  };
  return PostTopic;
};
