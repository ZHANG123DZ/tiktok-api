module.exports = (sequelize, DataTypes) => {
  const Like = sequelize.define(
    'Like',
    {
      userId: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
        field: 'user_id',
      },
      likeAbleId: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
        field: 'like_able_id',
      },
      likeAbleType: {
        type: DataTypes.TEXT,
        allowNull: false,
        field: 'like_able_type',
      },
    },
    {
      tableName: 'likes',
      timestamps: true,
      underscored: true,
      charset: 'utf8',
      collate: 'utf8_general_ci',
      engine: 'InnoDB',
      createdAt: 'createdAt',
      updatedAt: 'updatedAt',
      indexes: [
        {
          name: 'unique_like_user_target',
          unique: true,
          fields: ['user_id', 'like_able_type', 'like_able_id'],
        },
      ],
    }
  );
  Like.associate = (db) => {
    Like.belongsTo(db.User, {
      foreignKey: 'user_id',
      as: 'user',
    });
  };
  return Like;
};
