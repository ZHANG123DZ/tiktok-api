const { Topic, Post } = require("@/models/index");
const { where, Op } = require("sequelize");

class TopicsService {
  async getAll(page, limit) {
    const offset = (page - 1) * limit;

    const { rows: items, count: total } = await Topic.findAndCountAll({
      include: Post,
      limit,
      offset,
    });

    return { items, total };
  }

  async getById(topic_name) {
    const topic = await Topic.findOne({ where: { topic_name }, include: Post });
    return topic;
  }

  async create(data) {
    const topic = await Topic.create(data);
    return topic;
  }

  async update(topic_name, data) {
    const topic = await Topic.update(data, {
      where: {
        topic_name,
      },
    });
    return topic;
  }

  async remove(topic_name) {
    const topic = await Topic.destroy({ where: { topic_name } });
    return topic;
  }
}

module.exports = new TopicsService();
