module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'User',
    {
      username: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
      },
      email: {
        type: DataTypes.STRING(100),
        allowNull: true,
        unique: true,
      },
      phone: {
        type: DataTypes.STRING(20),
        allowNull: true,
        unique: true,
      },
      password: {
        allowNull: false,
        type: DataTypes.STRING(255),
      },
      name: {
        allowNull: true,
        type: DataTypes.STRING(191),
      },
      firstName: {
        allowNull: true,
        type: DataTypes.STRING(100),
        field: 'first_name',
      },
      lastName: {
        allowNull: true,
        type: DataTypes.STRING(100),
        field: 'last_name',
      },
      avatar: {
        allowNull: true,
        type: DataTypes.STRING(191),
      },
      bio: {
        allowNull: true,
        type: DataTypes.TEXT,
      },
      postCount: {
        defaultValue: 0,
        allowNull: true,
        type: DataTypes.BIGINT.UNSIGNED,
        // field: 'post_count',
      },
      followerCount: {
        defaultValue: 0,
        allowNull: true,
        type: DataTypes.BIGINT.UNSIGNED,
        field: 'follower_count',
      },
      followingCount: {
        defaultValue: 0,
        allowNull: true,
        type: DataTypes.BIGINT.UNSIGNED,
        field: 'following_count',
      },
      likeCount: {
        defaultValue: 0,
        allowNull: true,
        type: DataTypes.BIGINT.UNSIGNED,
        field: 'like_count',
      },
      reportCount: {
        defaultValue: 0,
        allowNull: true,
        type: DataTypes.BIGINT.UNSIGNED,
        field: 'report_count',
      },
      gender: {
        type: DataTypes.ENUM('male', 'female', 'other'),
        allowNull: true,
      },
      birthday: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      role: {
        type: DataTypes.STRING(100),
        type: DataTypes.STRING,
        allowNull: true,
      },
      status: {
        defaultValue: 'active',
        type: DataTypes.ENUM('active', 'inactive', 'banned'),
        allowNull: true,
      },
      twoFactorEnabled: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        field: 'two_factor_enabled',
      },
      isVerifiedBadge: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        field: 'is_verified_badge',
        defaultValue: false,
      },
      last_seen: {
        type: DataTypes.DATE(6),
        allowNull: true,
      },
      login_provider: {
        type: DataTypes.STRING(100),
        allowNull: true,
        field: 'login_provider',
      },
      lastSeen: {
        type: DataTypes.DATE(6),
        allowNull: true,
        field: 'last_seen',
      },
      lastLoginAt: {
        type: DataTypes.DATE(6),
        allowNull: true,
        field: 'last_login_at',
      },
      emailSentAt: {
        type: DataTypes.DATE(6),
        allowNull: true,
        field: 'email_sent_at',
      },
      verifiedAt: {
        type: DataTypes.DATE(6),
        allowNull: true,
        field: 'verified_at',
      },
    },
    {
      tableName: 'users',
      underscored: true,
      paranoid: true,
      charset: 'utf8',
      collate: 'utf8mb4_unicode_ci',
      engine: 'InnoDB',
      timestamps: true,
      createdAt: 'createdAt',
      updatedAt: 'updatedAt',
      deletedAt: 'deletedAt',
    }
  );
  User.associate = (db) => {
    User.hasOne(db.UserSetting, {
      foreignKey: 'userId',
      as: 'setting',
    });
    User.hasOne(db.Email, {
      foreignKey: 'userId',
      as: 'emailVerification',
    });
    User.hasMany(db.Comment, {
      foreignKey: 'authorId',
      as: 'comments',
    });
    User.hasMany(db.Follow, {
      foreignKey: 'userId',
      as: 'follows',
    });
    User.hasMany(db.Like, {
      foreignKey: 'userId',
      as: 'likes',
    });
    User.hasMany(db.BookMark, {
      foreignKey: 'userId',
      as: 'bookmarks',
    });
    User.hasMany(db.MessageRead, {
      foreignKey: 'userId',
      as: 'messageReads',
    });
    User.hasMany(db.Notification, {
      foreignKey: 'userId',
      as: 'notifications',
    });
    User.hasMany(db.Post, {
      foreignKey: 'authorId',
      as: 'posts',
    });
    User.hasMany(db.Message, {
      foreignKey: 'userId',
      as: 'messages',
    });
    User.hasMany(db.Music, {
      foreignKey: 'authorId',
      as: 'musicTracks',
    });
    User.hasMany(db.Search, {
      foreignKey: 'userId',
      as: 'searches',
    });
    User.hasMany(db.MessageSystem, {
      foreignKey: 'userId',
      as: 'systemMessages',
    });
    User.hasMany(db.Friend, {
      foreignKey: 'userId',
      as: 'friendsSent',
    });
    User.hasMany(db.VerificationCode, {
      foreignKey: 'userId',
      as: 'verificationCodes',
    });
    User.belongsToMany(db.Conversation, {
      through: db.UserConversation,
      foreignKey: 'userId',
      otherKey: 'conversationId',
      as: 'conversations',
    });
    User.hasMany(db.UserConversation, {
      foreignKey: 'userId',
      as: 'conversationMappings',
    });
    User.belongsToMany(db.Role, {
      through: db.UserRole,
      foreignKey: 'userId',
      otherKey: 'roleId',
      as: 'roles',
    });

    User.hasMany(db.UserRole, {
      foreignKey: 'userId',
      as: 'userRoles',
    });
  };
  return User;
};
