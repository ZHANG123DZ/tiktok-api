const { Comment } = require('@/models/index');

class commentsService {
  async getAll(post_id) {
    const items = await Comment.findAll({
      where: {
        post_id,
      },
    });
    return items;
  }

  async getById(id) {
    const comment = await Comment.findOne({
      where: {
        id,
      },
    });
    return comment;
  }

  async create(data) {
    const comment = await Comment.create(data);
    return comment;
  }

  async update(id, data) {
    const comment = await Comment.update(data, {
      where: {
        id,
      },
    });
    return comment;
  }

  async remove(id) {
    const comment = await Comment.destroy({
      where: {
        id,
      },
    });
    return comment;
  }
}

module.exports = new commentsService();
