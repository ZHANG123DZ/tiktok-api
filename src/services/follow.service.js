const pusher = require('@/configs/pusher');
const incrementField = require('@/helper/incrementField');
const { Follow, User, Post, Notification } = require('@/models/index');
const { getFollowTargetByType } = require('@/utils/followTarget');

class FollowsService {
  async getFollowers(type, followAbleId) {
    getFollowTargetByType(type);

    const { rows: items, count: total } = await Follow.findAndCountAll({
      where: {
        followAbleId,
        followAbleType: type,
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

  async getFollowing(userId, type) {
    const { model: Model, attributes } = getFollowTargetByType(type);

    const { rows: items, count: total } = await Follow.findAndCountAll({
      where: {
        userId,
        followAbleType: type,
      },
      attributes: ['followAbleId'],
    });

    const ids = items.map((f) => f.followAbleId);
    if (ids.length === 0) {
      return { data: [], total };
    }

    const users = await Model.findAll({
      where: { id: ids },
      attributes,
    });
    return { users, total };
  }

  async follow(userId, type, followAbleId) {
    const { model: Model, attributes } = getFollowTargetByType(type);
    const targetFollow = await Model.findOne({ where: { id: followAbleId } });
    if (!targetFollow || !userId) return false;

    const where = {
      userId,
      followAbleType: type,
      followAbleId,
    };

    const exists = await Follow.findOne({
      where,
      attributes: ['id', 'userId', 'followAbleId', 'followAbleType'],
    });

    if (exists) {
      return false;
    }
    await Follow.create(where);
    await incrementField(Model, 'follower_count', +1, { id: followAbleId });
    const notify = await Notification.create({
      type: 'follow',
      userId: followAbleId,
      notifiableId: userId,
      notifiableType: 'User',
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    pusher.trigger(
      `notifications-user-${followAbleId}`,
      'new-notification',
      notify
    );
    return true;
  }

  async unfollow(userId, type, followAbleId) {
    const { model: Model, attributes } = getFollowTargetByType(type);

    const user = await User.findOne({ where: { id: userId } });
    const targetFollow = await Model.findOne({ where: { id: followAbleId } });
    if (!targetFollow || !user) return false;

    const where = {
      userId,
      followAbleType: type,
      followAbleId,
    };
    await Follow.destroy({
      where: where,
    });
    await incrementField(Model, 'follower_count', -1, { id: followAbleId });
    return;
  }

  async check(userId, type, followAbleId) {
    const { model: Model, attributes } = getFollowTargetByType(type);

    const user = await User.findOne({ where: { id: userId } });
    const targetFollow = await Model.findOne({ where: { id: followAbleId } });
    if (!targetFollow || !user) return false;

    const where = {
      userId,
      followAbleType: type,
      followAbleId,
    };

    const exits = await Follow.findOne({
      where: where,
      attributes: ['id', 'userId', 'followAbleId', 'followAbleType'],
    });
    return !!exits;
  }
}
module.exports = new FollowsService();
