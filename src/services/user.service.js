const { User } = require("@/models/index");

class UsersService {
  async getAll(page, limit) {
    const offset = (page - 1) * limit;

    const { rows: items, count: total } = await User.findAndCountAll({
      limit,
      offset,
      order: [["created_at", "DESC"]],
    });

    return { items, total };
  }

  async getByKey(key) {
    const isId = /^\d+$/.test(key);
    const user = await User.findOne({
      where: isId ? { id: key } : { username: key },
    });
    return user;
  }

  async create(data) {
    const user = await User.create(data);
    return user;
  }

  async update(key, data) {
    const isId = /^\d+$/.test(key);
    const user = await User.update(data, {
      where: isId ? { id: key } : { username: key },
    });
    return user;
  }

  async remove(key) {
    const isId = /^\d+$/.test(key);
    const user = await User.destroy({
      where: isId ? { id: key } : { username: key },
    });
    return user;
  }
}

module.exports = new UsersService();
