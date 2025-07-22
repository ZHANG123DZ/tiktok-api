const { User, Post } = require("@/models");

const BOOKMARKABLE_TYPES = {
  user: {
    model: User,
    attributes: ["id", "username", "avatar_url", "full_name"],
  },
  post: {
    model: Post,
    attributes: [
      "id",
      "title",
      "slug",
      "author_id",
      "author_name",
      "created_at",
    ],
  },
};

function getBookMarkTargetByType(type) {
  const config = BOOKMARKABLE_TYPES[type];
  if (!config) throw new Error("Unsupported follow_able_type");
  return config;
}

module.exports = {
  getBookMarkTargetByType,
};
