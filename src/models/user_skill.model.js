module.exports = (sequelize, DataTypes) => {
  const UserSkill = sequelize.define(
    "UserSkill",
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
      skill_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
        references: {
          model: "skills",
          key: "id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
    },
    {
      tableName: "user_skills",
      timestamps: true,
      underscored: true,
      charset: "utf8",
      collate: "utf8_general_ci",
      engine: "InnoDB",
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );
  UserSkill.associate = (db) => {
    UserSkill.belongsTo(db.User, {
      foreignKey: "user_id",
      as: "user",
    });
    UserSkill.belongsTo(db.Skill, {
      foreignKey: "skill_id",
      as: "skill",
    });
  };
  return UserSkill;
};
