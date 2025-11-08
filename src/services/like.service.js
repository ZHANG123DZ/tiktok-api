const checkPostInteractions = require('@/helper/checkPostInteractions');
const incrementField = require('@/helper/incrementField');
const { Like, User, Post, Comment } = require('@/models/index');
const { getLikeTargetByType } = require('@/utils/likeTarget');

class LikesService {
  async getLikes(type, likeAbleId) {
    getLikeTargetByType(type);

    const { rows: items, count: total } = await Like.findAndCountAll({
      where: {
        likeAbleId,
        likeAbleType: type,
      },
      attributes: ['userId'],
    });

    const ids = items.map((f) => f.userId);
    if (ids.length === 0) {
      return { data: [], total };
    }

    const users = await User.findAll({
      where: { id: ids },
      attributes: ['id', 'username', 'avatar', 'name'],
    });
    return { users, total };
  }

  async getLikedUserId(userId, type) {
    const { model: Model, attributes } = getLikeTargetByType(type);

    const { rows: items, count: total } = await Like.findAndCountAll({
      where: {
        userId,
        likeAbleType: type,
      },
      attributes: ['likeAbleId'],
      order: [['createdAt', 'DESC']],
    });

    const ids = items.map((f) => f.likeAbleId);
    if (ids.length === 0) {
      return { data: [], total };
    }

    const posts = await Model.findAll({
      where: { id: ids },
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
        'commentCount',
        'createdAt',
        'viewCount',
        'likeCount',
        'publishedAt',
      ],
      distinct: true,
    });

    const orderedPosts = ids
      .map((id) => posts.find((p) => p.id === id))
      .filter(Boolean);
    const postItems = orderedPosts.map((post) => {
      const plain = post.get({ plain: true });

      plain.author = {
        id: plain.authorId,
        avatar: plain.authorAvatar,
        username: plain.authorUserName,
        name: plain.authorName,
      };

      delete plain.authorId;
      delete plain.authorAvatar;
      delete plain.authorUserName;
      delete plain.authorName;

      return plain;
    });

    return { posts: postItems, total };
  }

  async like(userId, type, likeAbleId) {
    const { model: Model, attributes } = getLikeTargetByType(type);
    const targetLike = await Model.findOne({ where: { id: likeAbleId } });
    if (!targetLike) return false;

    const where = {
      userId,
      likeAbleType: type,
      likeAbleId,
    };
    const exists = await Like.findOne({
      where,
      attributes: ['id', 'userId', 'likeAbleId', 'likeAbleType'],
    });

    if (exists) {
      return false;
    }

    await Like.create(where);

    await incrementField(Model, 'like_count', +1, { id: likeAbleId });

    if (Model === Post) {
      const post = await Post.findByPk(likeAbleId);
      if (post) {
        await incrementField(User, 'like_count', +1, { id: post.authorId });
      }
    }

    return true;
  }

  async unlike(userId, type, likeAbleId) {
    const { model: Model, attributes } = getLikeTargetByType(type);

    const user = await User.findOne({ where: { id: userId } });
    const targetLike = await Model.findOne({ where: { id: likeAbleId } });
    if (!targetLike || !user) return false;

    const where = {
      userId,
      likeAbleType: type,
      likeAbleId,
    };
    await Like.destroy({
      where: where,
    });
    await incrementField(Model, 'like_count', -1, { id: likeAbleId });

    if (Model === Post) {
      const post = await Post.findByPk(likeAbleId);
      if (post) {
        await incrementField(User, 'like_count', -1, { id: post.authorId });
      }
    }
    return;
  }

  async check(userId, type, likeAbleId) {
    const { model: Model, attributes } = getLikeTargetByType(type);

    const user = await User.findOne({ where: { id: userId } });
    const targetLike = await Model.findOne({ where: { id: likeAbleId } });
    if (!targetLike || !user) return false;

    const where = {
      userId,
      likeAbleType: type,
      likeAbleId,
    };

    const exits = await Like.findOne({
      where: where,
      attributes: ['id', 'userId', 'likeAbleId', 'likeAbleType'],
    });
    return !!exits;
  }
}

module.exports = new LikesService();
