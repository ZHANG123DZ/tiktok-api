module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User",
    {
      username: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
      },
      email: {
        type: DataTypes.STRING(100),
        allowNull: true,
        unique: true,
      },
      phone: {
        type: DataTypes.STRING(20),
        allowNull: true,
        unique: true,
      },
      password: {
        type: DataTypes.STRING(255),
        allowNull: true,
        defaultValue: null,
      },
      full_name: {
        type: DataTypes.STRING(191),
        allowNull: true,
      },
      first_name: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      last_name: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      avatar_url: {
        type: DataTypes.STRING(191),
        allowNull: true,
      },
      cover_url: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      title: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      bio: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      social: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      posts_count: {
        type: DataTypes.BIGINT,
        defaultValue: 0,
        allowNull: true,
      },
      followers_count: {
        type: DataTypes.BIGINT,
        defaultValue: 0,
        allowNull: true,
      },
      following_count: {
        type: DataTypes.BIGINT,
        defaultValue: 0,
        allowNull: true,
      },
      likes_count: {
        type: DataTypes.BIGINT,
        defaultValue: 0,
        allowNull: true,
      },
      gender: {
        type: DataTypes.ENUM("male", "female", "other"),
        allowNull: true,
      },
      birthday: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      role: {
        type: DataTypes.ENUM("user", "admin"),
        allowNull: true,
      },
      status: {
        type: DataTypes.ENUM("active", "inactive", "banned"),
        allowNull: true,
        defaultValue: "active",
      },
      location: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      website: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      skills: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      badges: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      two_factor_enabled: {
        type: DataTypes.BOOLEAN,
        defaultValue: 0,
      },
      login_provider: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      last_login_at: {
        type: DataTypes.DATE(6),
        allowNull: true,
      },
      email_sent_at: {
        type: DataTypes.DATE(6),
        allowNull: true,
      },
      verified_at: {
        type: DataTypes.DATE(6),
        allowNull: true,
      },
      deleted_at: {
        type: DataTypes.DATE(6),
        allowNull: true,
      },
    },
    {
      tableName: "users",
      underscored: true,
      charset: "utf8",
      collate: "utf8_general_ci",
      engine: "InnoDB",
      timestamps: false,
    }
  );
  User.associate = (db) => {
    // User.hasMany(db.Post);
  };
  return User;
};
