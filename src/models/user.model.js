module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'User',
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
        allowNull: false,
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
      bio: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      gender: {
        type: DataTypes.ENUM('male', 'female', 'other'),
        allowNull: true,
      },
      birthday: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      role: {
        type: DataTypes.ENUM('user', 'admin'),
        allowNull: true,
      },
      status: {
        type: DataTypes.ENUM('active', 'inactive', 'banned'),
        allowNull: true,
        defaultValue: 'active',
      },
      cover_url: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      location: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      login_provider: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      last_login_at: {
        type: DataTypes.DATE(6),
        allowNull: true,
      },
      verified_at: {
        type: DataTypes.DATE(6),
        allowNull: true,
      },
      email_sent_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
      },
      deleted_at: {
        type: DataTypes.DATE(6),
        allowNull: true,
      },
    },
    {
      tableName: 'users',
      timestamps: true,
      underscored: true,
      charset: 'utf8',
      collate: 'utf8_general_ci',
      engine: 'InnoDB',
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  );
  User.associate = (db) => {
    User.hasMany(db.RefreshToken);
  };
  return User;
};
