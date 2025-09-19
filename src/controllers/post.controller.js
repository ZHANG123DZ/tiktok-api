const postService = require('@/services/post.service');

const response = require('@/utils/response');
const throwError = require('@/utils/throwError');

const index = async (req, res) => {
  const { page, limit } = req;
  const userId = req.user?.id;
  const { items, total } = await postService.getAll(page, limit, userId);
  res.paginate({ items, total });
};

const featured = async (req, res) => {
  const { page, limit } = req;
  const userId = req.user?.id;
  const { items, total } = await postService.featured(page, limit, userId);
  res.paginate({ items, total });
};

const related = async (req, res) => {
  const { page, limit } = req;
  const preTopics = req.body.topics;
  const userId = req.user?.id;
  const { items, total } = await postService.related(
    page,
    limit,
    preTopics,
    userId
  );
  res.paginate({ items, total });
};

const latest = async (req, res) => {
  const { page, limit } = req;
  const userId = req.user?.id;
  const { items, total } = await postService.latest(page, limit, userId);
  res.paginate({ items, total });
};

const show = async (req, res) => {
  const userId = req.user?.id;
  const post = await postService.getByKey(req.params.key, userId);
  if (!post) throwError(404, 'Not Found.');

  response.success(res, 200, post);
};

const store = async (req, res) => {
  const user = req.user;
  const post = await postService.create(req.body, user);
  response.success(res, 201, post);
};

const update = async (req, res) => {
  const post = await postService.update(req.params.key, req.body);

  if (!post) throwError(404, 'Not Found.');

  response.success(res, 200, post);
};

const destroy = async (req, res) => {
  const user = req.user;
  const result = await postService.remove(req.params.key, user);
  if (!result) throwError(404, 'Not Found.');
  response.success(res, 204);
};

module.exports = {
  show,
  index,
  store,
  update,
  destroy,
  featured,
  related,
  latest,
};
