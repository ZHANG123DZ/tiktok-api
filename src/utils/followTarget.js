const { User, Post } = require('@/models');

const FOLLOWABLE_TYPES = {
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
};

function getFollowTargetByType(type) {
  const config = FOLLOWABLE_TYPES[type];
  if (!config) throw new Error('Unsupported follow_able_type');
  return config;
}

module.exports = {
  getFollowTargetByType,
};
