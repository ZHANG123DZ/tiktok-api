const { Post, Topic, Comment } = require("@/models/index");
const { nanoid } = require("nanoid");
const { where, Op } = require("sequelize");
const { default: slugify } = require("slugify");

class PostsService {
  async getAll(page, limit) {
    const offset = (page - 1) * limit;

    const { rows: items, count: total } = await Post.findAndCountAll({
      include: [Topic, Comment],
      limit,
      offset,
      order: [["created_at", "DESC"]],
    });

    return { items, total };
  }

  async getByKey(key) {
    const isId = /^\d+$/.test(key);
    const post = await Post.findOne({
      where: isId ? { id: key } : { slug: key },
      include: [Topic, Comment],
    });
    return post;
  }

  async create(data) {
    const toSlug = (title) => {
      return `${slugify(title, { lower: true, strict: true })}-${nanoid(6)}`;
    };
    if (!data.slug) {
      data.slug = toSlug(data.title);
    }
    const post = await Post.create(data);
    return post;
  }

  async update(key, data) {
    const toSlug = (title) => {
      return `${slugify(title, { lower: true, strict: true })}-${nanoid(6)}`;
    };
    data.slug = toSlug(data.title);
    const isId = /^\d+$/.test(key);
    const post = await Post.update(data, {
      where: isId ? { id: key } : { slug: key },
    });
    return post;
  }

  async remove(key) {
    const isId = /^\d+$/.test(key);
    const post = await Post.destroy({
      where: isId ? { id: key } : { slug: key },
    });
    return post;
  }
}

module.exports = new PostsService();
