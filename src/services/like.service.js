const incrementField = require("@/helper/incrementField");
const { Like, User, Post, Sequelize, sequelize } = require("@/models/index");
const { getLikeTargetByType } = require("@/utils/likeTarget");

class LikesService {
  async getLikes(type, likeAbleId) {
    getLikeTargetByType(type);

    const { rows: items, count: total } = await Like.findAndCountAll({
      where: {
        like_able_id: likeAbleId,
        like_able_type: type,
      },
      attributes: ["user_id"],
    });

    const ids = items.map((f) => f.user_id);
    if (ids.length === 0) {
      return { data: [], total };
    }

    const users = await User.findAll({
      where: { id: ids },
      attributes: ["id", "username", "avatar_url", "full_name"],
    });
    return { users, total };
  }

  async getLikedUserId(userId, type) {
    const { model: Model, attributes } = getLikeTargetByType(type);

    const { rows: items, count: total } = await Like.findAndCountAll({
      where: {
        user_id: userId,
        like_able_type: type,
      },
      attributes: ["like_able_id"],
    });

    const ids = items.map((f) => f.like_able_id);
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
      user_id: userId,
      like_able_type: type,
      like_able_id: likeAbleId,
    };
    const exists = await Like.findOne({
      where,
      attributes: ["id", "user_id", "like_able_id", "like_able_type"],
    });

    if (exists) {
      return false;
    }

    await Like.create(where);

    await incrementField(Model, "like_count", +1, { id: likeAbleId });

    if (Model === Post) {
      const post = await Post.findByPk(likeAbleId);
      if (post) {
        await incrementField(User, "like_count", +1, { id: post.author_id });
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
      user_id: userId,
      like_able_type: type,
      like_able_id: likeAbleId,
    };
    await Like.destroy({
      where: where,
    });
    await incrementField(Model, "like_count", -1, { id: likeAbleId });
    if (Model === Post) {
      const post = await Post.findByPk(likeAbleId);
      if (post) {
        await incrementField(User, "like_count", -1, { id: post.author_id });
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
      user_id: userId,
      like_able_type: type,
      like_able_id: likeAbleId,
    };

    const exits = await Like.findOne({
      where: where,
      attributes: ["id", "user_id", "like_able_id", "like_able_type"],
    });
    return !!exits;
  }
}

module.exports = new LikesService();
