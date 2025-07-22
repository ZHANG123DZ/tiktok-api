module.exports = (sequelize, DataTypes) => {
  const UserSetting = sequelize.define(
    "UserSetting",
    {
      user_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
        primaryKey: true,
        references: {
          model: "users",
          key: "id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },

      // Giao diện
      theme: {
        type: DataTypes.ENUM("dark", "light"),
        allowNull: true,
        defaultValue: "light",
      },
      language: {
        type: DataTypes.STRING(100),
        allowNull: true,
        defaultValue: "english",
      },

      profileVisibility: {
        type: DataTypes.ENUM("public", "followers", "private"),
        allowNull: true,
        defaultValue: "public",
      },

      defaultPostVisibility: {
        type: DataTypes.ENUM("public", "private", "draft"),
        allowNull: true,
        defaultValue: "public",
      },
      requireCommentApproval: {
        type: DataTypes.TINYINT(1),
        allowNull: true,
        defaultValue: 0,
      },
      twoFactorEnabled: {
        type: DataTypes.TINYINT(1),
        allowNull: true,
        defaultValue: 0,
      },
      // Riêng tư
      requireCommentApproval: {
        type: DataTypes.TINYINT(1),
        allowNull: true,
        defaultValue: 0,
      },
      allowDirectMessages: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: "everyone",
      },
      allowComments: {
        type: DataTypes.TINYINT(1),
        allowNull: true,
        defaultValue: 1,
      },
      searchEngineIndexing: {
        type: DataTypes.TINYINT(1),
        allowNull: true,
        defaultValue: 1,
      },
      showViewCounts: {
        type: DataTypes.TINYINT(1),
        allowNull: true,
        defaultValue: 1,
      },
      showEmail: {
        type: DataTypes.TINYINT(1),
        allowNull: true,
        defaultValue: 1,
      },

      // Thông báo
      emailNewLikes: {
        type: DataTypes.TINYINT(1),
        allowNull: true,
        defaultValue: 1,
      },
      emailNewComments: {
        type: DataTypes.TINYINT(1),
        allowNull: true,
        defaultValue: 1,
      },
      emailNewFollowers: {
        type: DataTypes.TINYINT(1),
        allowNull: true,
        defaultValue: 1,
      },
      emailWeeklyDigest: {
        type: DataTypes.TINYINT(1),
        allowNull: true,
        defaultValue: 1,
      },
      pushNotifications: {
        type: DataTypes.TINYINT(1),
        allowNull: true,
        defaultValue: 1,
      },
    },
    {
      tableName: "user_settings",
      timestamps: true,
      underscored: false,
      charset: "utf8",
      collate: "utf8_general_ci",
      engine: "InnoDB",
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );
  UserSetting.associate = (db) => {
    UserSetting.belongsTo(db.User, {
      foreignKey: "user_id",
      as: "user",
    });
  };
  return UserSetting;
};
