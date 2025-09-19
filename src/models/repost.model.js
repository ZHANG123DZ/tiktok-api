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

  Repost.associate = (db) => {
    Repost.belongsTo(db.User, {
      foreignKey: 'user_id',
      as: 'user',
    });
    Repost.belongsTo(db.Post, {
      foreignKey: 'post_id',
      as: 'post',
    });
  };

  return Repost;
};
