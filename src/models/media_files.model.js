module.exports = (sequelize, DataTypes) => {
  const Comment = sequelize.define(
    'Comment',
    {
      post_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
        references: {
          model: 'posts',
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      type: {
        type: DataTypes.ENUM('image', 'video', 'audio'),
        allowNull: true,
      },
      mime_type: {
        type: DataTypes.STRING(191),
        allowNull: true,
      },
      url: {
        type: DataTypes.STRING(191),
        allowNull: false,
      },
      alt_text: {
        type: DataTypes.STRING(191),
        allowNull: true,
      },
      caption: {
        type: DataTypes.STRING(191),
        allowNull: true,
      },
      position: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: true,
      },
      duration: {
        type: DataTypes.FLOAT.UNSIGNED,
        allowNull: true,
      },
      size: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true,
      },
      width: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true,
      },
      height: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true,
      },
    },
    {
      tableName: 'media_files',
      timestamps: true,
      underscored: true,
      charset: 'utf8',
      paranoid: true,
      collate: 'utf8_general_ci',
      engine: 'InnoDB',
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  );
  Comment.associate = (db) => {
    Comment.belongsTo(db.Post, { foreignKey: 'post_id', as: 'post' });
  };
  return Comment;
};
