const { Queue } = require('@/models/index');

class queueService {
  async getAll() {
    const items = await Queue.findAll();
    return items;
  }

  async getById(id) {
    const queue = await Queue.findOne({
      where: {
        id,
      },
    });
    return queue;
  }
  async findPendingJobs() {
    const queue = await Queue.findAll({
      where: {
        status: 'pending',
      },
    });
    return queue;
  }
  async create(data) {
    const queue = await Queue.create(data);
    return queue;
  }

  async update(id, data) {
    const queue = await Queue.update(data, {
      where: {
        id,
      },
    });
    return queue;
  }

  async remove(id) {
    const queue = await Queue.destroy({
      where: {
        id,
      },
    });
    return queue;
  }
}
module.exports = new queueService();
