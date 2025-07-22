module.exports = (sequelize, DataTypes) => {
  const Skill = sequelize.define(
    "Skill",
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
    },
    {
      tableName: "skills",
      timestamps: true,
      underscored: true,
      charset: "utf8",
      collate: "utf8_general_ci",
      engine: "InnoDB",
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );
  Skill.associate = (db) => {
    Skill.hasMany(db.UserSkill, {
      foreignKey: "skill_id",
      as: "userSkills",
    });
    Skill.belongsToMany(db.User, {
      through: db.UserSkill,
      foreignKey: "skill_id",
      as: "users",
    });
  };
  return Skill;
};
