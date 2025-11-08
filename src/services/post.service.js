const { setupElasticPost } = require('@/function/elasticSetup');
const checkFollowManyUsers = require('@/helper/checkFollowManyUsers');
const checkPostInteractions = require('@/helper/checkPostInteractions');
const incrementField = require('@/helper/incrementField');
const {
  Post,
  Topic,
  Comment,
  PostTopic,
  Tag,
  User,
  Music,
  Sequelize,
  sequelize,
} = require('@/models/index');
const { nanoid } = require('nanoid');
const { where, Op } = require('sequelize');
const { default: slugify } = require('slugify');

class PostsService {
  async getAll(page, limit, userId) {
    const offset = (page - 1) * limit;

    const { rows: posts, count: total } = await Post.findAndCountAll({
      include: [
        {
          model: Tag,
          as: 'tags',
          attributes: ['id', 'name', 'slug'],
          through: { attributes: [] },
        },
        {
          model: Music,
          as: 'music',
          attributes: ['id', 'audio', 'title', 'slug', 'thumbnail'],
          include: [{ model: User, as: 'author', attributes: ['name'] }],
        },
      ],
      limit,
      offset,
      order: [['createdAt', 'DESC']],
    });

    const postIds = posts.map((p) => p.id);
    const authorIds = posts.map((p) => p.authorId);

    const interactions = await checkPostInteractions(postIds, userId);

    const follows = await checkFollowManyUsers(userId, authorIds);

    const items = posts.map((post) => {
      const plain = post.get({ plain: true });

      plain.author = {
        id: plain.authorId,
        username: plain.authorUserName,
        name: plain.authorName,
        avatar: plain.authorAvatar,
        isFollow: follows.get(plain.authorId) || false,
      };

      plain.tags = plain.tags.map((tag) => tag.name);

      delete plain.authorId;
      delete plain.authorUserName;
      delete plain.authorName;
      delete plain.authorAvatar;

      const { isLiked, isBookMarked } = interactions.get(post.id) || {};
      plain.isLiked = isLiked || false;
      plain.isBookMarked = isBookMarked || false;

      return plain;
    });

    return { items, total };
  }
  async GetFollowingPosts(page, limit, userId) {
    try {
      const offset = (page - 1) * limit;

      const followedPosts = await sequelize.query(
        `
    SELECT posts.id
    FROM follows
    INNER JOIN posts ON follows.follow_able_id = posts.author_id
    WHERE follows.user_id = :userId
    ORDER BY posts.created_at DESC
    LIMIT :limit OFFSET :offset
    `,
        {
          replacements: { userId, limit, offset },
          type: sequelize.QueryTypes.SELECT,
        }
      );

      if (!followedPosts.length) {
        return { items: [], total: 0 };
      }

      const postIds = followedPosts.map((p) => p.id);

      const { rows: posts, count: total } = await Post.findAndCountAll({
        where: { id: postIds },
        include: [
          {
            model: Tag,
            as: 'tags',
            attributes: ['id', 'name', 'slug'],
            through: { attributes: [] },
          },
          {
            model: Music,
            as: 'music',
            attributes: ['id', 'audio', 'title', 'slug', 'thumbnail'],
            include: [{ model: User, as: 'author', attributes: ['name'] }],
          },
        ],

        order: [[sequelize.literal(`FIELD(Post.id, ${postIds.join(',')})`)]],
      });

      const authorIds = posts.map((p) => p.authorId);
      const interactions = await checkPostInteractions(postIds, userId);
      const follows = await checkFollowManyUsers(userId, authorIds);

      const items = posts.map((post) => {
        const plain = post.get({ plain: true });

        plain.author = {
          id: plain.authorId,
          username: plain.authorUserName,
          name: plain.authorName,
          avatar: plain.authorAvatar,
          isFollow: follows.get(plain.authorId) || false,
        };

        plain.tags = plain.tags.map((tag) => tag.name);

        delete plain.authorId;
        delete plain.authorUserName;
        delete plain.authorName;
        delete plain.authorAvatar;

        const { isLiked, isBookMarked } = interactions.get(post.id) || {};
        plain.isLiked = isLiked || false;
        plain.isBookMarked = isBookMarked || false;

        return plain;
      });

      return { items, total };
    } catch (err) {
      console.log(err);
    }
  }

  async GetFriendsPosts(page, limit, userId) {
    const offset = (page - 1) * limit;

    const followedPosts = await sequelize.query(
      `
    SELECT DISTINCT p.*
FROM posts p
INNER JOIN friends f
    ON (
        (f.user_id = :userId AND f.friend_id = p.author_id)
        OR
        (f.friend_id = :userId AND f.user_id = p.author_id)
    )
ORDER BY p.created_at DESC
LIMIT :limit OFFSET :offset;

    `,
      {
        replacements: { userId, limit, offset },
        type: sequelize.QueryTypes.SELECT,
      }
    );

    // 2️⃣ Nếu không có post nào thì trả về luôn
    if (!followedPosts.length) {
      return { items: [], total: 0 };
    }

    // Lấy danh sách ID bài viết
    const postIds = followedPosts.map((p) => p.id);

    // 3️⃣ Truy vấn chi tiết bài viết bằng Sequelize ORM
    const { rows: posts, count: total } = await Post.findAndCountAll({
      where: { id: postIds },
      include: [
        {
          model: Tag,
          as: 'tags',
          attributes: ['id', 'name', 'slug'],
          through: { attributes: [] },
        },
        {
          model: Music,
          as: 'music',
          attributes: ['id', 'audio', 'title', 'slug', 'thumbnail'],
          include: [{ model: User, as: 'author', attributes: ['name'] }],
        },
      ],
      // Giữ nguyên thứ tự theo kết quả truy vấn SQL
      order: [[sequelize.literal(`FIELD(Post.id, ${postIds.join(',')})`)]],
    });

    // 4️⃣ Chuẩn bị dữ liệu tương tác và follow
    const authorIds = posts.map((p) => p.authorId);
    const interactions = await checkPostInteractions(postIds, userId);
    const follows = await checkFollowManyUsers(userId, authorIds);

    // 5️⃣ Chuẩn hóa dữ liệu trả về
    const items = posts.map((post) => {
      const plain = post.get({ plain: true });

      plain.author = {
        id: plain.authorId,
        username: plain.authorUserName,
        name: plain.authorName,
        avatar: plain.authorAvatar,
        isFollow: follows.get(plain.authorId) || false,
      };

      plain.tags = plain.tags.map((tag) => tag.name);

      delete plain.authorId;
      delete plain.authorUserName;
      delete plain.authorName;
      delete plain.authorAvatar;

      const { isLiked, isBookMarked } = interactions.get(post.id) || {};
      plain.isLiked = isLiked || false;
      plain.isBookMarked = isBookMarked || false;

      return plain;
    });

    // 6️⃣ Trả kết quả
    return { items, total };
  }
  async getTrendingPosts(limit = 10) {
    return await Post.findAll({
      attributes: {
        include: [
          [
            Sequelize.literal(`
            (
              (likeCount * 1 +
               commentCount * 2 +
               shareCount * 3 +
               bookMarkCount * 2 +
               viewCount * 0.2)
              / POWER(DATEDIFF(NOW(), createdAt) + 1, 1.2)
            )
          `),
            'popularityScore',
          ],
        ],
      },
      order: [[Sequelize.literal('popularityScore'), 'DESC']],
      limit,
    });
  }
  async featured(page, limit, userId) {
    const offset = (page - 1) * limit;

    const { rows: posts, count: total } = await Post.findAndCountAll({
      include: [
        {
          model: Topic,
          as: 'topics',
        },
      ],
      limit,
      offset,
      order: [['likeCount', 'DESC']],
    });
    const postIds = posts.map((p) => p.id);

    const interactions = await checkPostInteractions(postIds, userId);

    const items = posts.map((post) => {
      const plain = post.get({ plain: true });
      const { isLiked, isBookMarked } = interactions.get(post.id) || {};
      plain.isLiked = isLiked || false;
      plain.isBookMarked = isBookMarked || false;
      return plain;
    });
    return { items, total };
  }

  async related(page, limit, prevTopics, userId) {
    const offset = (page - 1) * limit;

    const { rows: posts, count: total } = await Post.findAndCountAll({
      include: [
        {
          model: Topic,
          as: 'topics',
          where: {
            name: {
              [Op.in]: prevTopics,
            },
          },
          required: true,
        },
      ],
      limit,
      offset,
      order: [['createdAt', 'DESC']],
      distinct: true,
    });
    const postIds = posts.map((p) => p.id);

    const interactions = await checkPostInteractions(postIds, userId);

    const items = posts.map((post) => {
      const plain = post.get({ plain: true });
      const { isLiked, isBookMarked } = interactions.get(post.id) || {};
      plain.isLiked = isLiked || false;
      plain.isBookMarked = isBookMarked || false;
      return plain;
    });

    return { items, total };
  }

  async latest(page, limit, userId) {
    const offset = (page - 1) * limit;

    const { rows: posts, count: total } = await Post.findAndCountAll({
      include: [
        {
          model: Topic,
          as: 'topics',
        },
      ],
      limit,
      offset,
      order: [['createdAt', 'DESC']],
    });
    const postIds = posts.map((p) => p.id);

    const interactions = await checkPostInteractions(postIds, userId);

    const items = posts.map((post) => {
      const plain = post.get({ plain: true });
      const { isLiked, isBookMarked } = interactions.get(post.id) || {};
      plain.isLiked = isLiked || false;
      plain.isBookMarked = isBookMarked || false;
      return plain;
    });
    return { items, total };
  }

  async getByKey(key, userId) {
    const isId = /^\d+$/.test(key);

    const post = await Post.findOne({
      where: isId ? { id: key } : { slug: key },
      include: [
        {
          model: User,
          as: 'author',
          attributes: [
            'id',
            'avatar',
            'bio',
            'name',
            'username',
            'postCount',
            'followerCount',
            'followingCount',
          ],
        },
        {
          model: Tag,
          as: 'tags',
          attributes: ['name'],
          through: { attributes: [] },
        },
        {
          model: Music,
          as: 'music',
          attributes: ['id'],
          include: [
            {
              model: User,
              as: 'author',
              attributes: ['name'],
            },
          ],
        },
      ],
    });

    if (!post) return null;

    const interactions = await checkPostInteractions([post.id], userId);
    const { isLiked, isBookMarked } = interactions.get(post.id) || {};
    const follows = await checkFollowManyUsers(userId, [post.authorId]);
    let plainPost = post.toJSON();

    plainPost = {
      ...plainPost,
      author: {
        ...post.author.dataValues,
        id: plainPost.authorId,
        avatar: plainPost.authorAvatar ?? plainPost.author?.avatar,
        username: plainPost.authorUserName ?? plainPost.author?.username,
        isFollow: follows.get(plainPost.authorId) || false,
      },
      tags: plainPost.tags.map((tag) => tag.name),
      isLiked,
      isBookMarked,
    };

    delete plainPost.authorId;
    delete plainPost.authorAvatar;
    delete plainPost.authorUserName;

    return plainPost;
  }

  async create(data, user) {
    const toSlug = (title) => {
      return `${slugify(title, { lower: true, strict: true })}-${nanoid(6)}`;
    };

    if (!data.slug) {
      data.slug = toSlug(data.title);
    }

    data.authorId = user.id;
    data.authorName = user.name;
    data.authorUserName = user.username;
    data.authorAvatar = user.avatar;

    // 1️⃣ Tạo bài viết
    const post = await Post.create(data);

    // 2️⃣ Gắn topic và tag song song
    await Promise.all([
      ...(data.topics?.map((id) =>
        PostTopic.create({ postId: post.id, topicId: id })
      ) || []),
      ...(data.tags?.map((id) =>
        PostTag.create({ postId: post.id, tagId: id })
      ) || []),
    ]);

    // 3️⃣ Cập nhật đếm (ngoài transaction)
    await Promise.all([
      incrementField(User, 'post_count', +1, { id: user.id }),
      incrementField(Topic, 'post_count', +1, {
        id: { [Op.in]: data.topics || [] },
      }),
      incrementField(Tag, 'post_count', +1, {
        id: { [Op.in]: data.tags || [] },
      }),
    ]);
    await setupElasticPost(data);
    return post;
  }

  async update(key, data) {
    const toSlug = (title) => {
      return `${slugify(title, { lower: true, strict: true })}-${nanoid(6)}`;
    };
    if (data.title) {
      data.slug = toSlug(data.title);
    }
    const isId = /^\d+$/.test(key);
    const post = await Post.update(data, {
      where: isId ? { id: key } : { slug: key },
    });
    return post;
  }

  async remove(key, user) {
    const isId = /^\d+$/.test(key);

    const post = await Post.findOne({
      where: isId ? { id: key } : { slug: key },
      include: [
        {
          model: Topic,
          as: 'topics',
          through: { attributes: [] },
        },
      ],
    });

    if (!post) throw new Error('Post not found');

    const topicIds = post.topics?.map((t) => t.id) || [];

    await PostTopic.destroy({ where: { postId: post.id } });

    await Post.destroy({ where: { id: post.id } });

    await incrementField(User, 'post_count', -1, { id: user.id });
    if (topicIds.length > 0) {
      await incrementField(Topic, 'post_count', -1, {
        id: { [Op.in]: topicIds },
      });
    }

    return { message: 'Post deleted successfully' };
  }
}

module.exports = new PostsService();
