module.exports = (sequelize, DataTypes) => {
  const UserSetting = sequelize.define(
    'UserSetting',
    {
      userId: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
        primaryKey: true,
        references: {
          model: 'users',
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
        field: 'user_id',
      },

      // Giao diện
      theme: {
        type: DataTypes.ENUM('dark', 'light'),
        allowNull: true,
        defaultValue: 'light',
      },

      language: {
        type: DataTypes.STRING(100),
        allowNull: true,
        defaultValue: 'english',
      },

      location: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },

      profileVisibility: {
        type: DataTypes.ENUM('public', 'followers', 'private'),
        allowNull: true,
        defaultValue: 'public',
        field: 'profile_visibility',
      },

      defaultPostVisibility: {
        type: DataTypes.ENUM('public', 'private', 'draft'),
        allowNull: true,
        defaultValue: 'public',
        field: 'post_visibility',
      },
      requireCommentApproval: {
        type: DataTypes.TINYINT(1),
        allowNull: true,
        defaultValue: 0,
        field: 'require_comment_approval',
      },
      twoFactorEnabled: {
        type: DataTypes.TINYINT(1),
        allowNull: true,
        defaultValue: 0,
        field: 'two_factor_enabled',
      },
      // Riêng tư
      allowDirectMessages: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: 'everyone',
        field: 'allow_direct_messages',
      },
      allowComments: {
        type: DataTypes.TINYINT(1),
        allowNull: true,
        defaultValue: 1,
        field: 'allow_comments',
      },
      searchEngineIndexing: {
        type: DataTypes.TINYINT(1),
        allowNull: true,
        defaultValue: 1,
        field: 'search_engine_indexing',
      },
      showViewCounts: {
        type: DataTypes.TINYINT(1),
        allowNull: true,
        defaultValue: 1,
        field: 'show_view_counts',
      },
      showEmail: {
        type: DataTypes.TINYINT(1),
        allowNull: true,
        defaultValue: 1,
        field: 'show_email',
      },

      // Thông báo
      emailNewLikes: {
        type: DataTypes.TINYINT(1),
        allowNull: true,
        defaultValue: 1,
        field: 'email_new_likes',
      },
      emailNewComments: {
        type: DataTypes.TINYINT(1),
        allowNull: true,
        defaultValue: 1,
        field: 'email_new_comments',
      },
      emailNewFollowers: {
        type: DataTypes.TINYINT(1),
        allowNull: true,
        defaultValue: 1,
        field: 'email_new_followers',
      },
      emailWeeklyDigest: {
        type: DataTypes.TINYINT(1),
        allowNull: true,
        defaultValue: 1,
        field: 'email_weekly_digest',
      },
      pushNotifications: {
        type: DataTypes.TINYINT(1),
        allowNull: true,
        defaultValue: 1,
        field: 'push_notifications',
      },
    },
    {
      tableName: 'user_settings',
      timestamps: true,
      underscored: true,
      charset: 'utf8',
      collate: 'utf8_general_ci',
      engine: 'InnoDB',
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  );
  UserSetting.associate = (db) => {
    UserSetting.belongsTo(db.User, {
      foreignKey: 'userId',
      as: 'user',
    });
  };
  return UserSetting;
};
