module.exports = (sequelize, DataTypes) => {
  const Queue = sequelize.define(
    'Queue',
    {
      type: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      status: {
        type: DataTypes.STRING(100),
        allowNull: false,
        defaultValue: 'pending',
      },
      payload: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
    },
    {
      tableName: 'queues',
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
  return Queue;
};
