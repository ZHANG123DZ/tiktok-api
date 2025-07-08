module.exports = (sequelize, DataTypes) => {
  const EmailVerification = sequelize.define(
    'EmailVerification',
    {
      id: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      email: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      otp_code: {
        type: DataTypes.STRING(6),
        allowNull: false,
      },
      expired_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      verified_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      deleted_at: {
        type: DataTypes.DATE(6),
        allowNull: true,
      },
    },
    {
      tableName: 'email_verifications',
      timestamps: true,
      underscored: true,
      charset: 'utf8',
      collate: 'utf8_general_ci',
      engine: 'InnoDB',
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  );
  return EmailVerification;
};
