module.exports = (sequelize, DataTypes) => {
  const Topic = sequelize.define(
    "Topic",
    {
      name: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
      },
      slug: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      icon_url: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      post_count: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        defaultValue: 0,
      },
      deleted_at: {
        type: DataTypes.DATE(6),
        allowNull: true,
      },
    },
    {
      tableName: "topics",
      timestamps: true,
      underscored: true,
      charset: "utf8",
      collate: "utf8_general_ci",
      engine: "InnoDB",
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );
  Topic.associate = (db) => {
    Topic.hasMany(db.PostTopic, {
      foreignKey: "topic_id",
      as: "postTopics",
    });
    Topic.belongsToMany(db.Post, {
      through: db.PostTopic,
      foreignKey: "topic_id",
      as: "posts",
    });
  };
  return Topic;
};
