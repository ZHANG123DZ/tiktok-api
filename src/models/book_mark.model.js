module.exports = (sequelize, DataTypes) => {
  const BookMark = sequelize.define(
    'BookMark',
    {
      userId: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
        field: 'user_id',
      },
      bookMarkAbleId: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
        field: 'book_mark_able_id',
      },
      bookMarkAbleType: {
        type: DataTypes.TEXT,
        allowNull: false,
        field: 'book_mark_able_type',
      },
    },
    {
      tableName: 'book_marks',
      timestamps: true,
      underscored: true,
      charset: 'utf8',
      collate: 'utf8_general_ci',
      engine: 'InnoDB',
      createdAt: 'createdAt',
      updatedAt: 'updatedAt',
      indexes: [
        {
          name: 'unique_book_mark_user_target',
          unique: true,
          fields: ['user_id', 'book_mark_able_type', 'book_mark_able_id'],
        },
      ],
    }
  );
  BookMark.associate = (db) => {
    BookMark.belongsTo(db.User, {
      foreignKey: 'user_id',
      as: 'user',
    });
  };
  return BookMark;
};
