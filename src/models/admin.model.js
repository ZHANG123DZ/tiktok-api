module.exports = (sequelize, DataTypes) => {
  const Admin = sequelize.define(
    'Admin',
    {
      username: {
        type: DataTypes.STRING(100),
        unique: true,
      },
      email: {
        type: DataTypes.STRING(100),
        unique: true,
      },
      phone: {
        type: DataTypes.STRING(20),
        unique: true,
      },
      password: {
        type: DataTypes.STRING(255),
      },
      name: {
        type: DataTypes.STRING(191),
      },
      first_name: {
        type: DataTypes.STRING(100),
      },
      last_name: {
        type: DataTypes.STRING(100),
      },
      avatar: {
        type: DataTypes.STRING(191),
      },
      bio: {
        type: DataTypes.TEXT,
      },
      gender: {
        type: DataTypes.ENUM('male', 'female', 'other'),
      },
      role: {
        type: DataTypes.STRING(100),
      },
      status: {
        type: DataTypes.ENUM('active', 'inactive', 'banned'),
      },
    },
    {
      tableName: 'admin',
      underscored: true,
      paranoid: true,
      charset: 'utf8',
      collate: 'utf8mb4_unicode_ci',
      engine: 'InnoDB',
      timestamps: true,
      createdAt: 'createdAt',
      updatedAt: 'updatedAt',
      deletedAt: 'deletedAt',
    }
  );
  return Admin;
};
