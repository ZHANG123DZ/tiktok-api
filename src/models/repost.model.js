module.exports = (sequelize, DataTypes) => {
  const Repost = sequelize.define(
    'Repost',
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
      postId: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
        references: {
          model: 'posts',
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
        field: 'post_id',
      },
    },
    {
      tableName: 'reposts',
      timestamps: true,
      underscored: true,
      charset: 'utf8',
      collate: 'utf8_general_ci',
      engine: 'InnoDB',
      createdAt: 'createdAt',
      updatedAt: 'updatedAt',
    }
  );

  Repost.associate = (db) => {
    Repost.belongsTo(db.User, {
      foreignKey: 'userId',
      as: 'user',
    });
    Repost.belongsTo(db.Post, {
      foreignKey: 'postId',
      as: 'post',
    });
  };

  return Repost;
};
