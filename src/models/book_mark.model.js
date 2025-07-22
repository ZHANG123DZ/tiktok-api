module.exports = (sequelize, DataTypes) => {
  const BookMark = sequelize.define(
    "BookMark",
    {
      user_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
      },
      book_mark_able_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
      },
      book_mark_able_type: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
    },
    {
      tableName: "book_marks",
      timestamps: true,
      underscored: true,
      charset: "utf8",
      collate: "utf8_general_ci",
      engine: "InnoDB",
      createdAt: "created_at",
      updatedAt: "updated_at",
      indexes: [
        {
          name: "unique_book_mark_user_target",
          unique: true,
          fields: ["user_id", "book_mark_able_type", "book_mark_able_id"],
        },
      ],
    }
  );
  BookMark.associate = (db) => {
    BookMark.belongsTo(db.User, {
      foreignKey: "user_id",
      as: "user",
    });
  };
  return BookMark;
};
