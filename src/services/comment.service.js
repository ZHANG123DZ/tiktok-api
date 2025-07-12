const { Comment, Post } = require("@/models/index");
const { where, Op } = require("sequelize");

class CommentsService {
  async getAll() {
    const items = await Comment.findAll({ include: Post });
    return { items };
  }

  async getById(id) {
    const comment = await Comment.findOne({ where: { id }, include: Post });
    console.log(comment);
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
    const comment = await Comment.destroy({ where: { id } });
    return comment;
  }
}

module.exports = new CommentsService();
