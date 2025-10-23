module.exports = (sequelize, DataTypes) => {
  const RolePermission = sequelize.define(
    'RolePermission',
    {
      roleId: {
        type: DataTypes.BIGINT.UNSIGNED,
        references: {
          model: 'users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
        allowNull: false,
        field: 'role_id',
      },
      permissionId: {
        type: DataTypes.BIGINT.UNSIGNED,
        references: {
          model: 'permissions',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
        allowNull: false,
        field: 'permission_id',
      },
    },
    {
      tableName: 'role_permissions',
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
  RolePermission.associate = (db) => {
    RolePermission.belongsTo(db.Role, { foreignKey: 'roleId', as: 'role' });
    RolePermission.belongsTo(db.Permission, {
      foreignKey: 'permissionId',
      as: 'permission',
    });
  };
  return RolePermission;
};
