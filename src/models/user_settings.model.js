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
        allowNull: false,
        defaultValue: "dark",
      },
      language: {
        type: DataTypes.STRING(100),
        allowNull: false,
        defaultValue: "english",
      },

      // Riêng tư
      is_private: {
        type: DataTypes.TINYINT(1),
        allowNull: false,
        defaultValue: 0,
      },
      muted: {
        type: DataTypes.TINYINT(1),
        allowNull: false,
        defaultValue: 1,
      },

      // Quyền chia sẻ video
      allow_comments: {
        type: DataTypes.TINYINT(1),
        allowNull: false,
        defaultValue: 1,
      },
      allow_downloads: {
        type: DataTypes.TINYINT(1),
        allowNull: false,
        defaultValue: 1,
      },
      allow_duet: {
        type: DataTypes.TINYINT(1),
        allowNull: false,
        defaultValue: 1,
      },
      allow_stitch: {
        type: DataTypes.TINYINT(1),
        allowNull: false,
        defaultValue: 1,
      },

      // Thông báo
      notify_likes: {
        type: DataTypes.TINYINT(1),
        allowNull: false,
        defaultValue: 1,
      },
      notify_comments: {
        type: DataTypes.TINYINT(1),
        allowNull: false,
        defaultValue: 1,
      },
      notify_new_followers: {
        type: DataTypes.TINYINT(1),
        allowNull: false,
        defaultValue: 1,
      },

      // Timestamp
      deleted_at: {
        type: DataTypes.DATE(6),
        allowNull: true,
      },
    },
    {
      tableName: "user_settings",
      timestamps: true,
      underscored: true,
      charset: "utf8",
      collate: "utf8_general_ci",
      engine: "InnoDB",
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );
  UserSetting.associate = (db) => {
    UserSetting.belongsTo(db.Post);
  };
  return UserSetting;
};
