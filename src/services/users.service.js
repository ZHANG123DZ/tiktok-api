const { User } = require('@/models/index');

class usersService {
  async getAll(page, limit) {
    const items = await User.findAll();
    return { items };
  }

  async getById(id) {
    const user = await User.findOne({ where: { id } });
    return user;
  }

  async create(data) {
    const user = await User.create(data);
    return user;
  }

  async update(id, data) {
    const user = await User.update(data, {
      where: {
        id,
      },
    });
    return user;
  }

  async remove(id) {
    const user = await User.destroy({ where: { id } });
    return user;
  }
}

module.exports = new usersService();
