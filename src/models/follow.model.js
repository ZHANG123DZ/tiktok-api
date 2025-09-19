module.exports = (sequelize, DataTypes) => {
  const Follow = sequelize.define(
    'Follow',
    {
      userId: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
        field: 'user_id',
      },
      followAbleId: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
        field: 'follow_able_id',
      },
      followAbleType: {
        type: DataTypes.TEXT,
        allowNull: false,
        field: 'follow_able_type',
      },
    },
    {
      tableName: 'follows',
      timestamps: true,
      underscored: true,
      charset: 'utf8',
      collate: 'utf8_general_ci',
      engine: 'InnoDB',
      createdAt: 'createdAt',
      updatedAt: 'updatedAt',
      indexes: [
        {
          name: 'unique_follow_user_target',
          unique: true,
          fields: ['user_id', 'follow_able_type', 'follow_able_id'],
        },
      ],
    }
  );
  Follow.associate = (db) => {
    Follow.belongsTo(db.User, {
      foreignKey: 'user_id',
      as: 'user',
    });
    Follow.belongsTo(db.User, {
      foreignKey: 'follow_able_id',
      as: 'following',
    });
    Follow.belongsTo(db.Post, {
      foreignKey: 'follow_able_id',
      as: 'postsFollowing',
    });
  };
  return Follow;
};
