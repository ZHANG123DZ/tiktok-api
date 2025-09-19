const { Post, Music, Tag, User } = require('@/models');

class MusicService {
  async getMusic(id) {
    let music = await Music.findOne({
      where: { id: id },
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['username', 'name'],
        },
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
        },
      ],
    });
    if (!music) return null;
    const plainMusic = music.toJSON();
    plainMusic.posts = (plainMusic.posts || []).map((post) => {
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
    return plainMusic;
  }
}

module.exports = new MusicService();
