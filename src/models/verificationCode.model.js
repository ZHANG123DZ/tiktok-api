module.exports = (sequelize, DataTypes) => {
  const VerificationCode = sequelize.define(
    'VerificationCode',
    {
      id: {
        type: DataTypes.BIGINT.UNSIGNED,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
      },
      userId: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: true,
        field: 'user_id',
        references: {
          model: 'users',
          key: 'id',
        },
        onDelete: 'CASCADE',
        defaultValue: null,
      },
      target: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      code: {
        type: DataTypes.STRING(10),
        allowNull: false,
      },
      action: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      expiresAt: {
        type: DataTypes.DATE,
        allowNull: false,
        field: 'expires_at',
      },
      usedAt: {
        type: DataTypes.DATE,
        allowNull: true,
        field: 'used_at',
      },
    },
    {
      tableName: 'verification_codes',
      underscored: true,
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  );

  VerificationCode.associate = (db) => {
    VerificationCode.belongsTo(db.User, {
      foreignKey: 'userId',
      as: 'user',
    });
  };

  return VerificationCode;
};
