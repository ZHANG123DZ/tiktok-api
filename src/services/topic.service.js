const { Topic, Post } = require('@/models/index');
const { where, Op } = require('sequelize');

class TopicService {
  async getAll(page, limit) {
    const offset = (page - 1) * limit;

    const { rows: items, count: total } = await Topic.findAndCountAll({
      limit,
      offset,
      order: [['createdAt', 'DESC']],
    });

    return { items, total };
  }

  async getById(slug) {
    const topic = await Topic.findOne({
      where: { slug },
      include: [
        {
          model: Post,
          as: 'posts',
        },
      ],
    });
    return topic;
  }

  async create(data) {
    const topic = await Topic.create(data);
    return topic;
  }

  async update(slug, data) {
    const topic = await Topic.update(data, {
      where: {
        slug,
      },
    });
    return topic;
  }

  async remove(slug) {
    const topic = await Topic.destroy({ where: { slug } });
    return topic;
  }
}

module.exports = new TopicService();
