const likesService = require('@/services/likes.service');

const response = require('@/utils/response');
const throwError = require('@/utils/throwError');

const like = async (req, res) => {
  const post_id = req.params.post_id;
  const user_id = req.params.user_id;
  const likes = await likesService.like(post_id, user_id);
  response.success(res, 200, likes);
};

const dislike = async (req, res) => {
  const post_id = req.params.post_id;
  const user_id = req.params.user_id;
  const likes = await likesService.dislike(post_id, user_id);
  response.success(res, 200, likes);
};

module.exports = { like, dislike };
