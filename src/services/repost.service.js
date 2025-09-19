const pusher = require('@/configs/pusher');
const incrementField = require('@/helper/incrementField');
const { Comment, Post, User, Like, Sequelize } = require('@/models/index');
const { where, Op } = require('sequelize');

class CommentsService {
  async getPostComment(slug, page, limit, currentUserId) {
    const post = await Post.findOne({ where: { slug } });
    if (!post) throw new Error('Post not found');

    const offset = (page - 1) * limit;

    const parentComments = await Comment.findAll({
      where: {
        postId: post.id,
        parentId: null,
      },
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['id', 'name', 'avatar', 'username'],
        },
      ],
      order: [['likeCount', 'ASC']],
      limit,
      offset,
    });

    const parentIds = parentComments.map((c) => c.id);

    const replies = await Comment.findAll({
      where: {
        postId: post.id,
        parentId: parentIds.length > 0 ? parentIds : null,
      },
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['id', 'name', 'avatar', 'username'],
        },
      ],
      order: [['likeCount', 'ASC']],
    });

    const allComments = [...parentComments, ...replies];

    const commentIds = allComments.map((c) => c.id);
    let likedSet = new Set();
    if (currentUserId && commentIds.length > 0) {
      const liked = await Like.findAll({
        where: {
          userId: currentUserId,
          likeAbleId: commentIds,
          likeAbleType: 'comment',
        },
      });
      likedSet = new Set(liked.map((l) => l.likeAbleId));
    }

    function buildCommentTree(comments, parentId = null) {
      return comments
        .filter((c) => c.parentId === parentId)
        .map((c) => {
          const children = buildCommentTree(comments, c.id);
          return {
            ...c.toJSON(),
            isLiked: likedSet.has(c.id),
            isEdited:
              new Date(c.updatedAt).getTime() -
                new Date(c.createdAt).getTime() >
              1000,
            replies: children,
          };
        });
    }

    const tree = buildCommentTree(allComments);

    const total = await Comment.count({
      where: {
        postId: post.id,
      },
    });

    return {
      comments: tree,
      total,
      page,
      limit,
    };
  }

  async getById(id) {
    const comment = await Comment.findOne({
      where: { id },
      include: [
        {
          model: User,
          as: 'author',
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
          as: 'author',
          attributes: ['id', 'name', 'avatar'],
        },
        {
          model: Comment,
          as: 'replies',
          attributes: ['id', 'content', 'userId', 'postId'],
        },
      ],
    });
    comment.dataValues.isLiked = false;
    await incrementField(Post, 'commentCount', +1, {
      id: comment.postId,
    });
    comment.dataValues.author = {
      avatar: comment.author.avatar,
      name: comment.author.name,
    };

    comment.dataValues.createdAt = comment.createdAt;
    comment.dataValues.likeCount = Number(comment.likeCount);
    pusher.trigger(`post-${data.postId}-comments`, 'new-comment', comment);
    return comment;
  }

  async update(id, data) {
    const comment = await Comment.update(data, {
      where: {
        id,
      },
    });
    const updatedComment = await Comment.findByPk(id, {
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['id', 'name', 'avatar'],
        },
        {
          model: Comment,
          as: 'replies',
          attributes: ['id', 'content', 'userId', 'postId'],
        },
      ],
    });

    // Format thêm field nếu cần
    updatedComment.dataValues.isLiked = false;
    updatedComment.dataValues.author = {
      name: updatedComment.author.name,
      avatar: updatedComment.author.avatar,
    };
    updatedComment.dataValues.createdAt = updatedComment.createdAt;
    updatedComment.dataValues.likes = Number(updatedComment.likeCount);

    // Trigger sự kiện realtime
    pusher.trigger(
      `post-${updatedComment.postId}-comments`,
      'updated-comment',
      updatedComment
    );
    return comment;
  }

  async remove(id) {
    const comment = await Comment.findByPk(id);
    await Comment.destroy({ where: { id } });
    await incrementField(Post, 'commentCount', -1, { id: comment.postId });
    pusher.trigger(
      `post-${comment.postId}-comments`,
      'delete-comment',
      Number(id)
    );
    return comment;
  }
}

module.exports = new CommentsService();
