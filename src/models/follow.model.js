module.exports = (sequelize, DataTypes) => {
  const Follow = sequelize.define(
    "Follow",
    {
      user_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
      },
      follow_able_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
      },
      follow_able_type: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
    },
    {
      tableName: "follows",
      timestamps: true,
      underscored: true,
      charset: "utf8",
      collate: "utf8_general_ci",
      engine: "InnoDB",
      createdAt: "created_at",
      updatedAt: "updated_at",
      indexes: [
        {
          name: "unique_follow_user_target",
          unique: true,
          fields: ["user_id", "follow_able_type", "follow_able_id"],
        },
      ],
    }
  );

  Follow.associate = (db) => {
    // Follow.belongsTo(db.Post);
  };
  return Follow;
};
