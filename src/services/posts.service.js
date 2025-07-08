const { Post } = require('@/models/index');

class postsService {
  async getAll() {
    const items = await Post.findAll();
    return items;
  }

  async getById(id) {
    const post = await Post.findOne({
      where: {
        id,
      },
    });
    return post;
  }

  async create(data) {
    const post = await Post.create(data);
    return post;
  }

  async update(id, data) {
    const post = await Post.update(data, {
      where: {
        id,
      },
    });
    return post;
  }

  async remove(id) {
    const post = await Post.destroy({
      where: {
        id,
      },
    });
    return post;
  }
}

module.exports = new postsService();
