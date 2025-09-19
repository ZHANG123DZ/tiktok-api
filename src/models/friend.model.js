module.exports = (sequelize, DataTypes) => {
  const Friend = sequelize.define(
    'Friend',
    {
      userId: {
        type: DataTypes.BIGINT.UNSIGNED,
        references: {
          model: 'users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        field: 'user_id',
      },
      friendId: {
        type: DataTypes.BIGINT.UNSIGNED,
        references: {
          model: 'users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        field: 'friend_id',
      },
      status: {
        type: DataTypes.ENUM('pending', 'accepted', 'blocked'),
      },
    },
    {
      tableName: 'friends',
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
  Friend.associate = (db) => {
    Friend.belongsTo(db.User, {
      foreignKey: 'user_id',
      as: 'sender',
    });

    Friend.belongsTo(db.User, {
      foreignKey: 'friend_id',
      as: 'receiver',
    });
  };
  return Friend;
};
