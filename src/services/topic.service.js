const checkPostInteractions = require('@/helper/checkPostInteractions');
const { Topic, Post, Tag } = require('@/models');

class TopicService {
  async getAll() {
    return await Topic.findAll({ attributes: ['name'] });
  }

  async getTopic(name, page = 1, limit = 10, userId) {
    const offset = (page - 1) * limit;

    const postAttributes = [
      'id',
      'content',
      'thumbnail',
      'description',
      'title',
      'likeCount',
      'viewCount',
      'authorId',
      'authorName',
      'authorAvatar',
      'authorUserName',
      'publishedAt',
    ];

    const tagInclude = {
      model: Tag,
      as: 'tags',
      attributes: ['name'],
      through: { attributes: [] },
    };

    let topicFilterInclude = null;
    let topicName = 'Tất cả';

    if (name !== 'all') {
      const topic = await Topic.findOne({ where: { name } });
      if (!topic) return null;

      topicName = topic.name;

      topicFilterInclude = {
        model: Topic,
        as: 'topics',
        where: { id: topic.id },
        attributes: [],
        through: { attributes: [] },
      };
    }

    const include = topicFilterInclude
      ? [topicFilterInclude, tagInclude]
      : [tagInclude];

    const { rows: posts, count: total } = await Post.findAndCountAll({
      attributes: postAttributes,
      include,
      order: [['publishedAt', 'DESC']],
      limit,
      offset,
    });

    const formattedPosts = posts.map((post) => {
      const p = post.get({ plain: true });

      const { authorName, authorUserName, authorAvatar, ...rest } = p;

      return {
        ...rest,
        author: {
          name: authorName,
          username: authorUserName,
          avatar: authorAvatar,
        },
        tags: p.tags?.map((t) => t.name) || [],
      };
    });

    return {
      name: topicName,
      posts: formattedPosts,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
      },
    };
  }

  async getById(name, userId) {
    const topic = await Topic.findOne({
      where: { name },
      include: [
        {
          model: Post,
          as: 'posts',
        },
      ],
    });

    if (!topic) return null;

    const postIds = topic.posts.map((p) => p.id);
    const interactions = await checkPostInteractions(postIds, userId);

    const plainTopic = topic.get({ plain: true });

    plainTopic.posts = plainTopic.posts.map((post) => {
      const { isLiked = false, isBookMarked = false } =
        interactions.get(post.id) || {};

      return {
        ...post,
        isLiked,
        isBookMarked,
        author: {
          name: post.authorName,
          username: post.authorUserName,
          avatar: post.authorAvatar,
        },
      };
    });

    return plainTopic;
  }
}

module.exports = new TopicService();
