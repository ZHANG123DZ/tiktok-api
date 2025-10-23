module.exports = (sequelize, DataTypes) => {
  const Share = sequelize.define(
    'Share',
    {
      title: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      type: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      targetId: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: true,
        field: 'target_id',
      },
      userId: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: true,
        references: {
          model: 'users',
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
        field: 'user_id',
      },
    },
    {
      tableName: 'shares',
      timestamps: true,
      underscored: true,
      charset: 'utf8',
      collate: 'utf8_general_ci',
      engine: 'InnoDB',
      createdAt: 'createdAt',
      updatedAt: 'updatedAt',
    }
  );
  Share.associate = (db) => {
    Share.belongsTo(db.User, {
      foreignKey: 'userId',
      as: 'shareAuthor',
    });
  };
  return Share;
};
