module.exports = (sequelize, DataTypes) => {
  const Comment = sequelize.define(
    "Comment",
    {
      post_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
        references: {
          model: "posts",
          key: "id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },

      user_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },

      content: {
        type: DataTypes.TEXT,
        allowNull: false,
      },

      parent_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: true,
        references: {
          model: "comments",
          key: "id",
        },
        onDelete: "SET NULL",
        onUpdate: "CASCADE",
      },

      like_count: {
        type: DataTypes.BIGINT,
        allowNull: true,
        defaultValue: 0,
      },

      deleted_at: {
        type: DataTypes.DATE(6),
        allowNull: true,
      },
    },
    {
      tableName: "comments",
      timestamps: true,
      underscored: true,
      charset: "utf8",
      collate: "utf8_general_ci",
      engine: "InnoDB",
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );
  Comment.associate = (db) => {
    Comment.belongsTo(db.Post, {
      foreignKey: "post_id",
      as: "post",
    });

    Comment.belongsTo(db.User, {
      foreignKey: "user_id",
      as: "author",
    });

    Comment.belongsTo(db.Comment, {
      foreignKey: "parent_id",
      as: "parent",
    });

    Comment.hasMany(db.Comment, {
      foreignKey: "parent_id",
      as: "replies",
    });
  };
  return Comment;
};
