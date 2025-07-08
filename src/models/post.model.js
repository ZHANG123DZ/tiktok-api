module.exports = (sequelize, DataTypes) => {
  const Post = sequelize.define(
    'Post',
    {
      title: {
        type: DataTypes.STRING(191),
        allowNull: true,
        defaultValue: '',
      },
      slug: {
        type: DataTypes.STRING(191),
        allowNull: true,
        unique: true,
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },

      author_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      author_name: {
        type: DataTypes.STRING(191),
        allowNull: true,
      },

      view_count: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: true,
        defaultValue: 0,
      },
      like_count: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: true,
        defaultValue: 0,
      },
      comment_count: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: true,
        defaultValue: 0,
      },
      report_count: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: true,
        defaultValue: 0,
      },

      language: {
        type: DataTypes.STRING(191),
        allowNull: true,
      },
      visibility: {
        type: DataTypes.ENUM('public', 'private', 'unlisted'),
        allowNull: false,
        defaultValue: 'public',
      },
      moderation_status: {
        type: DataTypes.ENUM('approved', 'pending', 'rejected'),
        allowNull: false,
        defaultValue: 'approved',
      },

      thumbnail_url: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      meta_title: {
        type: DataTypes.STRING(191),
        allowNull: true,
        defaultValue: '',
      },
      meta_description: {
        type: DataTypes.STRING(191),
        allowNull: false,
        defaultValue: '',
      },
      reading_time: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true,
        defaultValue: 0,
      },

      is_pinned: {
        type: DataTypes.TINYINT(1).UNSIGNED,
        allowNull: false,
        defaultValue: 0,
      },
      is_featured: {
        type: DataTypes.TINYINT(1).UNSIGNED,
        allowNull: false,
        defaultValue: 0,
      },
      has_media: {
        type: DataTypes.TINYINT(1).UNSIGNED,
        allowNull: false,
        defaultValue: 0,
      },

      published_at: {
        type: DataTypes.DATE(6),
        allowNull: false,
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP(6)'),
      },
      deleted_at: {
        type: DataTypes.DATE(6),
        allowNull: true,
      },
      visibility_updated_at: {
        type: DataTypes.DATE(6),
        allowNull: true,
      },
    },
    {
      tableName: 'posts',
      timestamps: true,
      underscored: true,
      charset: 'utf8',
      collate: 'utf8_general_ci',
      engine: 'InnoDB',
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  );
  Post.associate = (db) => {
    Post.belongsTo(db.User, {
      foreignKey: 'author_id',
      as: 'author',
    });

    Post.hasMany(db.Comment, {
      foreignKey: 'post_id',
      as: 'comments',
    });

    Post.belongsToMany(db.Topic, {
      through: 'posts_topics',
      foreignKey: 'post_id',
      otherKey: 'topic_id',
      as: 'topics',
    });
  };
  return Post;
};
