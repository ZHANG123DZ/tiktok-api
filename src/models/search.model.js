module.exports = (sequelize, DataTypes) => {
  const Search = sequelize.define(
    'Search',
    {
      userId: {
        type: DataTypes.BIGINT.UNSIGNED,
        references: {
          model: 'users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
        allowNull: true,
        defaultValue: null,
        field: 'user_id',
      },
      keyword: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
    },
    {
      tableName: 'searches',
      timestamps: true,
      paranoid: true,
      underscored: true,
      charset: 'utf8',
      collate: 'utf8_general_ci',
      engine: 'InnoDB',
      createdAt: 'createdAt',
      updatedAt: 'updatedAt',
      deletedAt: 'deletedAt',
      indexes: [
        {
          unique: true,
          fields: ['userId', 'keyword'],
        },
      ],
    }
  );
  Search.associate = (db) => {
    Search.belongsTo(db.User, {
      foreignKey: 'userId',
      as: 'searchAuthor',
    });
  };
  return Search;
};
