const {
  User,
  Post,
  UserSkill,
  Skill,
  UserBadge,
  Badge,
  Topic,
  Follow,
} = require("@/models/index");

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
      include: [
        {
          model: Skill,
          as: "skillList",
        },
        {
          model: Badge,
          as: "badgeList",
        },
      ],
      attributes: [
        "id",
        "username",
        "full_name",
        "first_name",
        "last_name",
        "avatar_url",
        "cover_url",
        "title",
        "bio",
        "post_count",
        "follower_count",
        "following_count",
        "like_count",
        "location",
        "website",
        "created_at",
        "social",
      ],
    });

    return user;
  }

  async getUserPosts(key, page, limit) {
    const isId = /^\d+$/.test(key);
    const user = await User.findOne({
      where: isId ? { id: key } : { username: key },
      attributes: ["id", "username", "avatar_url", "full_name"],
    });
    if (!user) throw new Error("User not found");
    const offset = (page - 1) * limit;
    const { rows: items, count: total } = await Post.findAndCountAll({
      where: { author_id: user.id },
      order: [["created_at", "DESC"]],
      limit,
      offset,
      attributes: [
        "id",
        "title",
        "excerpt",
        "slug",
        "cover_url",
        "thumbnail_url",
        "status",
        "author_id",
        "author_name",
        "author_avatar",
        "author_username",
        "created_at",
        "view_count",
        "like_count",
        "comment_count",
        "published_at",
        "reading_time",
      ],
      include: [
        {
          model: Topic,
          as: "topics",
        },
      ],
    });
    return { items, limit };
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
