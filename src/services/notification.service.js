const checkFollowManyUsers = require('@/helper/checkFollowManyUsers');
const { User, Post, Comment, Notification } = require('@/models/index');

class NotificationService {
  async getAllNotify(page, limit, userId) {
    const offset = (page - 1) * limit;

    const { rows, count: total } = await Notification.findAndCountAll({
      where: { userId },
      limit,
      offset,
      order: [['createdAt', 'DESC']],
      include: [
        {
          model: User,
          as: 'actor',
          attributes: ['id', 'username', 'name', 'avatar'],
        },
      ],
    });

    const actorIds = [...new Set(rows.map((n) => n.actor?.id).filter(Boolean))];

    const followMap = await checkFollowManyUsers(userId, actorIds);

    const mappedItems = await Promise.all(
      rows.map(async (n) => {
        const notify = n.get({ plain: true });
        let link = '';

        switch (notify.type) {
          case 'like_post':
          case 'new_post': {
            const post = await Post.findByPk(notify.notifiableId, {
              attributes: ['id', 'authorUserName', 'title', 'thumbnail'],
            });
            if (post) link = `/@${post.authorUserName}/video/${post.id}`;
            break;
          }

          case 'like_comment':
          case 'new_comment':
          case 'reply_comment': {
            const comment = await Comment.findByPk(notify.notifiableId, {
              include: [
                {
                  model: Post,
                  as: 'post',
                  attributes: ['id', 'authorUserName', 'thumbnail'],
                },
              ],
            });
            if (comment?.post)
              link = `/@${comment.post.authorUserName}/video/${comment.post.id}?comment=${comment.id}`;
            break;
          }

          case 'follower': {
            const follower = await User.findByPk(notify.notifiableId, {
              attributes: ['username'],
            });
            if (follower) link = `/@${follower.username}`;
            break;
          }

          default:
            link = '/';
        }

        const actor = notify.actor
          ? {
              ...notify.actor,
              isFollow: followMap.get(notify.actor.id) || false,
            }
          : null;

        return {
          id: notify.id,
          type: notify.type,
          read: !!notify.readAt,
          actor,
          link,
          createdAt: notify.createdAt,
        };
      })
    );

    const grouped = mappedItems.reduce((acc, item) => {
      if (!acc[item.type]) acc[item.type] = [];
      acc[item.type].push(item);
      return acc;
    }, {});

    return { items: grouped, total };
  }

  async getAllNotifyByType(page, limit, userId, type) {
    const offset = (page - 1) * limit;

    const { rows, count: total } = await Notification.findAndCountAll({
      where: { userId, type },
      limit,
      offset,
      order: [['createdAt', 'DESC']],
      include: [
        {
          model: User,
          as: 'actor',
          attributes: ['id', 'username', 'name', 'avatar'],
        },
      ],
    });

    const actorIds = [...new Set(rows.map((n) => n.actor?.id).filter(Boolean))];

    const followMap = await checkFollowManyUsers(userId, actorIds);

    const mappedItems = await Promise.all(
      rows.map(async (n) => {
        const notify = n.get({ plain: true });
        let link = '';

        switch (notify.type) {
          case 'like_post':
          case 'new_post': {
            const post = await Post.findByPk(notify.notifiableId, {
              attributes: ['id', 'authorUserName', 'title', 'thumbnail'],
            });
            if (post) link = `/@${post.authorUserName}/video/${post.id}`;
            break;
          }

          case 'like_comment':
          case 'new_comment':
          case 'reply_comment': {
            const comment = await Comment.findByPk(notify.notifiableId, {
              include: [
                {
                  model: Post,
                  as: 'post',
                  attributes: ['id', 'authorUserName', 'thumbnail'],
                },
              ],
            });
            if (comment?.post)
              link = `/@${comment.post.authorUserName}/video/${comment.post.id}?comment=${comment.id}`;
            break;
          }

          case 'follower': {
            const follower = await User.findByPk(notify.notifiableId, {
              attributes: ['username'],
            });
            if (follower) link = `/@${follower.username}`;
            break;
          }

          default:
            link = '/';
        }

        const actor = notify.actor
          ? {
              ...notify.actor,
              isFollow: followMap.get(notify.actor.id) || false,
            }
          : null;

        return {
          id: notify.id,
          type: notify.type,
          read: !!notify.readAt,
          actor,
          link,
          createdAt: notify.createdAt,
        };
      })
    );

    return { items: mappedItems, total };
  }

  async create({ type, userId, actorId, notifiableId, notifiableType }) {
    if (!type || !userId || !notifiableId || !notifiableType) {
      throw new Error('Thiếu dữ liệu bắt buộc để tạo thông báo.');
    }

    const notify = await Notification.create({
      type,
      userId,
      actorId: actorId || null,
      notifiableId,
      notifiableType,
      readAt: null,
    });

    return notify;
  }

  async update(data, id) {
    await Notification.update(data, { where: { id } });
    return;
  }

  async readAll(userId) {
    await Notification.update(
      { readAt: new Date() },
      { where: { userId: userId } }
    );
    return;
  }
}

module.exports = new NotificationService();
