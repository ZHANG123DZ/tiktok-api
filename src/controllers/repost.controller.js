const repostService = require('@/services/repost.service');

const response = require('@/utils/response');
const throwError = require('@/utils/throwError');

const index = async (req, res) => {
  const userId = req.params.id;

  try {
    const reposts = await repostService.index(userId);
    return response.success(res, 200, reposts);
  } catch (error) {
    return response.error(res, 404, error);
  }
};

// const show = async (req, res) => {
//   const repost = await repostService.getById(req.params.id);

//   if (!repost) throwError(404, 'Not Found.');

//   response.success(res, 200, repost);
// };

const store = async (req, res) => {
  const currentUserId = req.user.id;
  const repost = await repostService.create(req.body.postId, currentUserId);
  response.success(res, 201, repost);
};

const destroy = async (req, res) => {
  const result = await repostService.remove(req.params.id);

  if (!result) throwError(404, 'Not Found.');

  response.success(res, 204);
};

module.exports = { index, store, destroy };
