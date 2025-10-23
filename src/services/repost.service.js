const pusher = require('@/configs/pusher');
const incrementField = require('@/helper/incrementField');
const { Repost, Post } = require('@/models/index');

class RepostService {
  async index(userId) {
    const { rows: items, count: total } = await Repost.findAndCountAll({
      where: {
        userId,
      },
      attributes: ['postId'],
      order: [['createdAt', 'DESC']],
    });

    const ids = items.map((f) => f.postId);
    if (ids.length === 0) {
      return { posts: [], total };
    }

    const posts = await Post.findAll({
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

  async create(postId, userId) {
    const repost = await Repost.create({ postId, userId });
    if (!repost) {
      throw new Error('Không tạo thành công');
    }
    await incrementField(Post, 'repost_count', +1, { id: postId });
    return repost;
  }

  async remove(id) {
    const repost = Repost.findByPk(id, {
      attributes: ['postId'],
    });
    const deleted = await Repost.destroy({
      where: { id, postId: repost.postId },
    });
    if (!deleted) {
      throw new Error('Không hủy tạo thành công');
    }
    await incrementField(Post, 'repost_count', -1, { id: repost.postId });
    return true;
  }
}

module.exports = new RepostService();
