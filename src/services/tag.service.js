const { Post, Tag } = require('@/models');

class TagService {
  async getTag(name) {
    let tag = await Tag.findOne({
      where: { name: name },
      include: [
        {
          model: Post,
          as: 'posts',
          attributes: [
            'id',
            'content',
            'thumbnail',
            'description',
            'title',
            'likeCount',
            'viewCount',
            'authorId',
            'authorAvatar',
            'authorUserName',
            'publishedAt',
          ],
          include: [
            {
              model: Tag,
              as: 'tags',
              attributes: ['name'],
              through: { attributes: [] },
            },
          ],
          through: { attributes: [] },
        },
      ],
    });
    if (!tag) return null;
    const plainTag = tag.toJSON();
    plainTag.posts = (plainTag.posts || []).map((post) => {
      const newPost = {
        ...post,
        author: {
          avatar: post.authorAvatar,
          username: post.authorUserName,
        },
        tags: post.tags.map((tag) => tag.name),
      };
      delete newPost.authorAvatar;
      delete newPost.authorUserName;
      return newPost;
    });
    return plainTag;
  }
}

module.exports = new TagService();
