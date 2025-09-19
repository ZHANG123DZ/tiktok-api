module.exports = (sequelize, DataTypes) => {
  const Role = sequelize.define(
    'Role',
    {
      name: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      code: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
    },
    {
      tableName: 'roles',
      timestamps: true,
      paranoid: true,
      underscored: true,
      charset: 'utf8',
      collate: 'utf8_general_ci',
      engine: 'InnoDB',
      createdAt: 'createdAt',
      updatedAt: 'updatedAt',
      deletedAt: 'deletedAt',
    }
  );
  Role.associate = (db) => {
    Role.belongsToMany(db.User, {
      through: db.UserRole,
      foreignKey: 'role_id',
      otherKey: 'user_id',
      as: 'users',
    });

    Role.belongsToMany(db.Permission, {
      through: db.RolePermission,
      foreignKey: 'role_id',
      otherKey: 'permission_id',
      as: 'permissions',
    });

    Role.hasMany(db.UserRole, { foreignKey: 'role_id', as: 'userRoles' });
    Role.hasMany(db.RolePermission, {
      foreignKey: 'role_id',
      as: 'rolePermissions',
    });
  };
  return Role;
};
