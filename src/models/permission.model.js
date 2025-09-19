module.exports = (sequelize, DataTypes) => {
  const Permission = sequelize.define(
    'Permission',
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
      tableName: 'permissions',
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
  Permission.associate = (db) => {
    Permission.belongsToMany(db.Role, {
      through: db.RolePermission,
      foreignKey: 'permission_id',
      otherKey: 'role_id',
      as: 'roles',
    });

    Permission.hasMany(db.RolePermission, {
      foreignKey: 'permission_id',
      as: 'rolePermissions',
    });
  };
  return Permission;
};
