const { User, Post, Comment, Notification } = require('@/models/index');

class NotificationService {
  async getAllNotify(page, limit, userId) {
    const offset = (page - 1) * limit;

    const { rows: items, count: total } = await Notification.findAndCountAll({
      where: { userId },
      limit,
      offset,
      order: [['createdAt', 'DESC']],
      include: [
        {
          model: Post,
          as: 'post',
          attributes: ['id', 'title', 'authorUserName', 'thumbnail'],
          required: false,
        },
        {
          model: Comment,
          as: 'comment',
          attributes: ['id', 'content', 'postId'],
          include: [
            {
              model: Post,
              as: 'post',
              attributes: ['id', 'title', 'authorUserName', 'thumbnail'],
            },
          ],
          required: false,
        },
        {
          model: User,
          as: 'follower',
          attributes: ['id', 'name', 'username', 'avatar'],
          required: false,
        },
      ],
    });

    const mappedItems = items.map((n) => {
      const notify = n.get({ plain: true });
      let message = '';
      let link = '';

      switch (notify.type) {
        // case 'like_post':
        // // if (notify.comment) {
        // // }
        case 'like_comment':
          if (notify.post) {
            message = `${notify.follower?.name || 'Someone'} liked your post "${
              notify.post.title
            }"`;
            link = `/blog/${notify.post.slug}`;
          }
          break;

        case 'new_comment':
          if (notify.comment?.post) {
            message = `${
              notify.follower?.name || 'Someone'
            } commented on your post "${notify.comment.post.title}"`;
            link = `/blog/${notify.comment.post.slug}`;
          }
          break;

        case 'follow':
          if (notify.follower) {
            message = `${notify.follower.name}`;
            link = `/@${notify.follower.username}`;
          }
          break;

        case 'new_post':
          if (notify.post) {
            message = `${
              notify.follower?.name || 'Someone'
            } created a new post "${notify.post.title}"`;
            link = `/blog/${notify.post.slug}`;
          }
          break;

        default:
          message = 'You have a new notification';
          link = '/';
          break;
      }

      return {
        id: notify.id,
        type: notify.type,
        message,
        link,
        read: !!notify.readAt,
        createdAt: notify.createdAt,
      };
    });

    return { items: mappedItems, total };
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
