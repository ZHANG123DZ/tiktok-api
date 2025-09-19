const checkPostInteractions = require('@/helper/checkPostInteractions');
const { BookMark, User, Post, Topic } = require('@/models/index');
const { getBookMarkTargetByType } = require('@/utils/bookMarkTarget');

class BookMarksService {
  async getBookMarks(type, bookmarkAbleId) {
    getBookMarkTargetByType(type);

    const { rows: items, count: total } = await BookMark.findAndCountAll({
      where: {
        bookMarkAbleId: bookmarkAbleId,
        bookMarkAbleType: type,
      },
      attributes: ['userId'],
    });

    const ids = items.map((f) => f.userId);
    if (ids.length === 0) {
      return { data: [], total };
    }

    const users = await User.findAll({
      where: { id: ids },
      attributes: ['id', 'username', 'avatar', 'name'],
    });
    return { users, total };
  }

  async getBookMarkedUserId(userId, type, page, limit) {
    const offset = (page - 1) * limit;
    const { model: Model } = getBookMarkTargetByType(type);

    const { rows: bookmarks, count: total } = await BookMark.findAndCountAll({
      where: {
        userId,
        bookMarkAbleType: type,
      },
      limit,
      offset,
      attributes: ['bookMarkAbleId', 'createdAt'],
    });

    if (bookmarks.length === 0) {
      return { bookMarks: [], total };
    }

    const bookmarkTimeMap = new Map();
    const ids = [];

    bookmarks.forEach((b) => {
      ids.push(b.bookMarkAbleId);
      bookmarkTimeMap.set(b.bookMarkAbleId, b.createdAt);
    });

    const posts = await Model.findAll({
      where: { id: ids },
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['id', 'name', 'username', 'avatar'],
        },
        {
          model: Topic,
          as: 'topics',
          attributes: ['id', 'name', 'slug'],
        },
      ],
    });

    const interactions = await checkPostInteractions(ids, userId);

    const result = posts.map((post) => {
      const plain = post.get({ plain: true });
      const { isLiked, isBookMarked } = interactions.get(post.id) || {};
      plain.isLiked = isLiked || false;
      plain.isBookMarked = isBookMarked || false;
      plain.bookMarkedAt = bookmarkTimeMap.get(post.id);
      return plain;
    });

    return { bookMarks: result, total, limit };
  }

  async bookmark(userId, type, bookmarkAbleId) {
    const { model: Model, attributes } = getBookMarkTargetByType(type);
    const user = await User.findOne({ where: { id: userId } });
    const targetBookMark = await Model.findOne({
      where: { id: bookmarkAbleId },
    });
    if (!targetBookMark || !user) return false;

    const where = {
      userId,
      bookMarkAbleType: type,
      bookMarkAbleId: bookmarkAbleId,
    };

    const exists = await BookMark.findOne({
      where,
      attributes: ['id', 'userId', 'bookMarkAbleId', 'bookMarkAbleType'],
    });

    if (exists) {
      return false;
    }

    await BookMark.create(where);
    return true;
  }

  async unBookMark(userId, type, bookmarkAbleId) {
    const { model: Model, attributes } = getBookMarkTargetByType(type);

    const user = await User.findOne({ where: { id: userId } });
    const targetBookMark = await Model.findOne({
      where: { id: bookmarkAbleId },
    });
    if (!targetBookMark || !user) return false;

    const where = {
      userId,
      bookMarkAbleType: type,
      bookMarkAbleId: bookmarkAbleId,
    };
    const deleted = await BookMark.destroy({
      where: where,
    });
    return;
  }

  async check(userId, type, bookmarkAbleId) {
    const { model: Model, attributes } = getBookMarkTargetByType(type);

    const user = await User.findOne({ where: { id: userId } });
    const targetBookMark = await Model.findOne({
      where: { id: bookmarkAbleId },
    });
    if (!targetBookMark || !user) return false;

    const where = {
      userId,
      bookMarkAbleType: type,
      bookMarkAbleId: bookmarkAbleId,
    };

    const exits = await BookMark.findOne({
      where: where,
      attributes: ['id', 'userId', 'bookmarkAbleId', 'bookMarkAbleType'],
    });
    return !!exits;
  }

  async deleteAllBookMark(userId, type) {
    const result = await BookMark.destroy({
      where: { userId, bookMarkAbleType: type },
    });
    return result;
  }
}

module.exports = new BookMarksService();
