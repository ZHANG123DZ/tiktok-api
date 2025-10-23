const checkFollowManyUsers = require('@/helper/checkFollowManyUsers');
const checkPostInteractions = require('@/helper/checkPostInteractions');
const { User, Post, Tag } = require('@/models/index');

class UsersService {
  async getAll(page, limit) {
    const offset = (page - 1) * limit;

    const { rows: items, count: total } = await User.findAndCountAll({
      limit,
      offset,
      order: [['createdAt', 'DESC']],
    });

    return { items, total };
  }

  async getByKey(key, userId) {
    const isId = /^\d+$/.test(key);
    const user = await User.findOne({
      where: isId ? { id: key } : { username: key },
      attributes: [
        'id',
        'username',
        'name',
        'firstName',
        'lastName',
        'avatar',
        'bio',
        'postCount',
        'followerCount',
        'followingCount',
        'likeCount',
        'createdAt',
      ],
    });
    const isFollow = await checkFollowManyUsers(userId, [user.dataValues?.id]);
    user.dataValues.isFollow = isFollow.get(user.dataValues?.id);
    return user;
  }

  async getUserPosts(key, page, limit, userId) {
    const isId = /^\d+$/.test(key);
    const user = await User.findOne({
      where: isId ? { id: key } : { username: key },
      attributes: ['id', 'username', 'avatar', 'name'],
    });
    if (!user) throw new Error('User not found');
    const offset = (page - 1) * limit;
    const { rows: posts, count: total } = await Post.findAndCountAll({
      where: { authorId: user.id },
      order: [['createdAt', 'ASC']],
      limit,
      offset,
      attributes: [
        'id',
        'title',
        'content',
        'thumbnail',
        'status',
        'authorId',
        'authorName',
        'authorAvatar',
        'authorUserName',
        'createdAt',
        'viewCount',
        'likeCount',
        'isPinned',
        'isFeatured',
        'publishedAt',
      ],
      distinct: true,
      include: [
        {
          model: Tag,
          as: 'tags',
          attributes: ['name'],
          through: { attributes: [] },
        },
      ],
    });
    const postIds = posts.map((p) => p.id);

    const interactions = await checkPostInteractions(postIds, userId);

    const items = posts.map((post) => {
      const plain = post.get({ plain: true });
      const { isLiked, isBookMarked } = interactions.get(post.id) || {};
      plain.author = {
        id: plain.authorId,
        avatar: plain.authorAvatar,
        username: plain.authorUserName,
        name: plain.authorName,
      };
      plain.tags = post.tags.map((tag) => tag.name);
      plain.isLiked = isLiked || false;
      plain.isBookMarked = isBookMarked || false;

      delete plain.authorId;
      delete plain.authorAvatar;
      delete plain.authorUserName;
      delete plain.authorName;
      return plain;
    });

    return { items, limit, total };
  }

  async getIntroUsers(page, limit, userId) {
    const offset = (page - 1) * limit;

    const { rows: items, count: total } = await User.findAndCountAll({
      attributes: ['id', 'name', 'username', 'avatar', 'isVerifiedBadge'],
      include: {
        model: Post,
        attributes: ['id', 'thumbnail', 'content'],
        limit: 1,
        as: 'posts',
      },
      limit,
      offset,
      order: [['createdAt', 'DESC']],
    });

    const usersId = items.map((u) => u.id);

    const followMap = await checkFollowManyUsers(userId, usersId);

    const result = items.map((user) => {
      const isFollow = followMap.get(user.id) || false;

      return {
        id: user.id,
        name: user.name,
        username: user.username,
        avatar: user.avatar,
        isVerifiedBadge: user.isVerifiedBadge,
        intro: user.posts?.[0] || null,
        isFollow,
      };
    });

    return {
      total,
      items: result,
    };
  }

  async create(data) {
    const user = await User.create(data);
    return user;
  }

  async update(key, data) {
    const isId = /^\d+$/.test(key);
    const user = await User.update(data, {
      where: isId ? { id: key } : { username: key },
    });
    return user;
  }

  async remove(key) {
    const isId = /^\d+$/.test(key);
    const user = await User.destroy({
      where: isId ? { id: key } : { username: key },
    });
    return user;
  }
}

module.exports = new UsersService();
