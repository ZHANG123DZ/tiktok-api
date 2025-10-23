const commentsService = require('@/services/comment.service');

const response = require('@/utils/response');
const throwError = require('@/utils/throwError');

const index = async (req, res) => {
  const postId = req.params.postId;
  const currentUserId = req.user?.id;
  const { page, limit } = req;
  try {
    const comments = await commentsService.getPostComment(
      postId,
      page,
      limit,
      currentUserId
    );
    return response.success(res, 200, comments);
  } catch (error) {
    return response.error(res, 404, error);
  }
};

const show = async (req, res) => {
  const comment = await commentsService.getById(req.params.id);

  if (!comment) throwError(404, 'Not Found.');

  response.success(res, 200, comment);
};

const store = async (req, res) => {
  const currentUserId = req.user?.id;
  const data = req.body;
  const comment = await commentsService.create(data, currentUserId);
  return response.success(res, 201, comment);
};

const update = async (req, res) => {
  const comment = await commentsService.update(req.params.id, req.body);

  if (!comment) throwError(404, 'Not Found.');

  response.success(res, 201, comment);
};

const destroy = async (req, res) => {
  const { id, postId } = req.params;
  const result = await commentsService.remove(id, postId);

  if (!result) throwError(404, 'Not Found.');

  response.success(res, 204);
};

module.exports = { show, index, store, update, destroy };
