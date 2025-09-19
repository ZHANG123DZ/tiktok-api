require('module-alias/register');
const { Op } = require('sequelize');
const { Like, BookMark } = require('@/models');

/**
 * Kiểm tra like & bookmark của user đối với list bài viết
 * @param {Array<number>} postIds - Mảng ID bài viết
 * @param {number} userId - ID của user hiện tại
 * @returns {Promise<Map<number, { isLiked: boolean, isBookMarked: boolean }>>}
 */
async function checkPostInteractions(postIds, userId) {
  if (!postIds.length || !userId) {
    const res = new Map();
    postIds.forEach((id) => {
      res.set(id, {
        isLiked: false,
        isBookMarked: false,
      });
    });
    return res;
  }

  const likes = await Like.findAll({
    where: {
      userId,
      likeAbleType: 'post',
      likeAbleId: { [Op.in]: postIds },
    },
    attributes: ['likeAbleId'],
    raw: true,
  });

  const likedPostIds = new Set(likes.map((l) => l.likeAbleId));

  const bookmarks = await BookMark.findAll({
    where: {
      userId,
      bookMarkAbleType: 'post',
      bookMarkAbleId: { [Op.in]: postIds },
    },
    attributes: ['book_mark_able_id'],
    raw: true,
  });
  const bookmarkedPostIds = new Set(bookmarks.map((b) => b.bookMarkAbleId));

  const result = new Map();
  postIds.forEach((id) => {
    result.set(id, {
      isLiked: likedPostIds.has(id),
      isBookMarked: bookmarkedPostIds.has(id),
    });
  });

  return result;
}

module.exports = checkPostInteractions;
