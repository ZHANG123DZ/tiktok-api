const commentsService = require('@/services/comments.service');

const response = require('@/utils/response');
const throwError = require('@/utils/throwError');

const show = async (req, res) => {
  const post_id = req.params.post_id;
  const comments = await commentsService.getAll(post_id);
  response.success(res, 200, comments);
};

const index = async (req, res) => {
  const id = req.params.id;

  const comment = await commentsService.getById(id);

  if (!comment) throwError(404, 'Not Found.');

  response.success(res, 200, comment);
};

const store = async (req, res) => {
  const post_id = req.params.post_id;
  const data = req.body;
  data.post_id = post_id;
  const comment = await commentsService.create(data);

  response.success(res, 201, comment);
};

const update = async (req, res) => {
  const id = req.params.id;
  const data = req.body;
  const comment = await commentsService.update(id, data);

  if (!comment) throwError(404, 'Not Found.');

  response.success(res, 201, comment);
};

const destroy = async (req, res) => {
  const id = req.params.id;

  const result = await commentsService.remove(id);

  if (!result) throwError(404, 'Not Found');

  response.success(res, 204);
};

module.exports = { show, index, store, update, destroy };
