module.exports = (sequelize, DataTypes) => {
  const Tag = sequelize.define(
    'Suggestion',
    {
      text: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      type: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      refId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: 'ref_id',
      },
      searchCount: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: true,
        defaultValue: 0,
        field: 'search_count',
      },
    },
    {
      tableName: 'suggestions',
      timestamps: true,
      underscored: true,
      charset: 'utf8',
      collate: 'utf8_general_ci',
      engine: 'InnoDB',
      createdAt: 'createdAt',
      updatedAt: 'updatedAt',
    }
  );
  Tag.associate = (db) => {
    Tag.hasMany(db.PostTag, {
      foreignKey: 'tag_id',
      as: 'postTags',
    });
    Tag.belongsToMany(db.Post, {
      through: db.PostTag,
      foreignKey: 'tag_id',
      as: 'posts',
    });
  };
  return Tag;
};
