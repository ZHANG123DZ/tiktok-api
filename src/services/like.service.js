const incrementField = require('@/helper/incrementField');
const { Like, User, Post, Sequelize, sequelize } = require('@/models/index');
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
    });

    const ids = items.map((f) => f.likeAbleId);
    if (ids.length === 0) {
      return { data: [], total };
    }

    const users = await Model.findAll({
      where: { id: ids },
      attributes,
    });
    return { users, total };
  }

  async like(userId, type, likeAbleId) {
    const { model: Model, attributes } = getLikeTargetByType(type);
    const user = await User.findOne({ where: { id: userId } });
    const targetLike = await Model.findOne({ where: { id: likeAbleId } });
    if (!targetLike || !user) return false;

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
