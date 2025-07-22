module.exports = (sequelize, DataTypes) => {
  const UserBadge = sequelize.define(
    "UserBadge",
    {
      user_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      badge_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
        references: {
          model: "badges",
          key: "id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
    },
    {
      tableName: "user_badges",
      timestamps: true,
      underscored: true,
      charset: "utf8",
      collate: "utf8_general_ci",
      engine: "InnoDB",
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );
  UserBadge.associate = (db) => {
    UserBadge.belongsTo(db.User, {
      foreignKey: "user_id",
      as: "user",
    });
    UserBadge.belongsTo(db.Badge, {
      foreignKey: "badge_id",
      as: "badge",
    });
  };
  return UserBadge;
};
