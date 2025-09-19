const { User, Post, Comment } = require('@/models');

const LIKEABLE_TYPES = {
  user: {
    model: User,
    attributes: ['id', 'username', 'avatar', 'name'],
  },
  post: {
    model: Post,
    attributes: [
      'id',
      'title',
      'slug',
      'author_id',
      'author_name',
      'created_at',
    ],
  },
  comment: {
    model: Comment,
    attributes: [
      'id',
      'content',
      'post_id',
      'parent_id',
      'user_id',
      'created_at',
    ],
  },
};

function getLikeTargetByType(type) {
  const config = LIKEABLE_TYPES[type];
  if (!config) throw new Error('Unsupported like_able_type');
  return config;
}

module.exports = {
  getLikeTargetByType,
};
