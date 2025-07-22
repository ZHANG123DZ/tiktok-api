module.exports = (sequelize, DataTypes) => {
  const Like = sequelize.define(
    "Like",
    {
      user_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
      },
      like_able_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
      },
      like_able_type: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
    },
    {
      tableName: "likes",
      timestamps: true,
      underscored: true,
      charset: "utf8",
      collate: "utf8_general_ci",
      engine: "InnoDB",
      createdAt: "created_at",
      updatedAt: "updated_at",
      indexes: [
        {
          name: "unique_like_user_target",
          unique: true,
          fields: ["user_id", "like_able_type", "like_able_id"],
        },
      ],
    }
  );
  Like.associate = (db) => {
    Like.belongsTo(db.User, {
      foreignKey: "user_id",
      as: "user",
    });
  };
  return Like;
};
