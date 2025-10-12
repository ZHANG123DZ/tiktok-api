module.exports = (sequelize, DataTypes) => {
  const Comment = sequelize.define(
    'Comment',
    {
      postId: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
        references: {
          model: 'posts',
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
        field: 'post_id',
      },

      authorId: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
        field: 'author_id',
      },

      content: {
        type: DataTypes.TEXT,
        allowNull: false,
      },

      parentId: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: true,
        references: {
          model: 'comments',
          key: 'id',
        },
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
        field: 'parent_id',
      },

      likeCount: {
        type: DataTypes.BIGINT,
        allowNull: true,
        defaultValue: 0,
        field: 'like_count',
      },
    },
    {
      tableName: 'comments',
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
  Comment.associate = (db) => {
    Comment.belongsTo(db.Post, {
      foreignKey: 'postId',
      as: 'post',
    });

    Comment.belongsTo(db.User, {
      foreignKey: 'authorId',
      as: 'author',
    });

    Comment.belongsTo(db.Comment, {
      foreignKey: 'parentId',
      as: 'parent',
    });

    Comment.hasMany(db.Comment, {
      foreignKey: 'parentId',
      as: 'replies',
    });
  };
  return Comment;
};
