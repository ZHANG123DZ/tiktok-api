const { Comment, Post, User, Like } = require("@/models/index");
const { where, Op } = require("sequelize");

class CommentsService {
  async getPostComment(slug, currentUserId) {
    const post = await Post.findOne({ where: { slug } });
    if (!post) throw new Error("Post not found");

    const rawComments = await Comment.findAll({
      where: { post_id: post.id },
      include: [
        {
          model: User,
          as: "author",
          attributes: ["id", "full_name", "avatar_url", "username"],
        },
      ],
      attributes: [
        "id",
        "content",
        "created_at",
        "like_count",
        "parent_id",
        "user_id",
        "post_id",
      ],
      order: [["created_at", "ASC"]],
    });

    const commentIds = rawComments.map((c) => c.id);
    let likedSet = new Set();
    if (commentIds.length > 0) {
      const liked = await Like.findAll({
        where: {
          user_id: currentUserId,
          like_able_id: commentIds,
          like_able_type: "comment",
        },
      });
      likedSet = new Set(liked.map((l) => l.like_able_id));
    }

    function buildCommentTree(comments, parentId = null) {
      return comments
        .filter((c) => c.parent_id === parentId)
        .map((c) => {
          const children = buildCommentTree(comments, c.id);
          return {
            ...c.toJSON(),
            isLiked: likedSet.has(c.id),
            replies: children,
          };
        });
    }

    return buildCommentTree(rawComments);
  }

  async getById(id) {
    const comment = await Comment.findOne({
      where: { id },
      include: [
        {
          model: User,
          as: "author",
        },
      ],
    });
    return comment;
  }

  async create(data, currentUserId) {
    const comment = await Comment.create(data);
    await comment.reload({
      include: [
        {
          model: User,
          as: "author",
          attributes: ["id", "full_name", "avatar_url"],
        },
        {
          model: Comment,
          as: "replies",
          attributes: ["id", "content", "user_id", "post_id"],
        },
      ],
    });
    comment.dataValues.isLiked = false;
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
