module.exports = (sequelize, DataTypes) => {
  const Topic = sequelize.define(
    'Topic',
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
    },
    {
      tableName: 'topics',
      timestamps: true,
      underscored: true,
      charset: 'utf8',
      paranoid: true,
      collate: 'utf8_general_ci',
      engine: 'InnoDB',
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  );
  Topic.associate = (db) => {
    Topic.belongsToMany(db.Post, {
      through: 'posts_topics',
      foreignKey: 'topic_id',
      otherKey: 'post_id',
      as: 'posts',
    });
  };
  return Topic;
};
