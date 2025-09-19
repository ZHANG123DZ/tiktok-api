module.exports = (sequelize, DataTypes) => {
  const UserRole = sequelize.define(
    'UserRole',
    {
      userId: {
        type: DataTypes.BIGINT.UNSIGNED,
        references: {
          model: 'users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
        allowNull: false,
        field: 'user_id',
      },
      roleId: {
        type: DataTypes.BIGINT.UNSIGNED,
        references: {
          model: 'roles',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
        allowNull: false,
        field: 'role_id',
      },
    },
    {
      tableName: 'user_roles',
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
  UserRole.associate = (db) => {
    UserRole.belongsTo(db.User, { foreignKey: 'user_id', as: 'user' });
    UserRole.belongsTo(db.Role, { foreignKey: 'role_id', as: 'role' });
  };
  return UserRole;
};
