const postsService = require('@/services/posts.service');

const response = require('@/utils/response');
const throwError = require('@/utils/throwError');

const transporter = require('@/configs/mail');
const index = async (req, res) => {
  // const message = {
  //   from: 'khanh123tran999@gmail.com',
  //   to: 'trungquanidol324@gmail.com',
  //   subject: 'Message title',
  //   html: `<p style="color: red;">Xin chào Đây là TikTok</p>`,
  // };
  // const info = await transporter.sendMail(message);
  // console.log(info);
  const posts = await postsService.getAll();
  response.success(res, 200, posts);
};

const pagination = async (req, res) => {
  const page = req.query.page || 1;
  const limit = req.query.limit || 10;

  const posts = await postsService.getPaginated(page, limit);
  response.success(res, 200, posts);
};

const show = async (req, res) => {
  const post = await postsService.getById(req.params.id);

  if (!post) throwError(404, 'Not Found.');

  response.success(res, 200, post);
};

const store = async (req, res) => {
  const post = await postsService.create(req.body);
  response.success(res, 201, post);
};

const update = async (req, res) => {
  const post = await postsService.update(req.params.id, req.body);

  if (!post) throwError(404, 'Not Found.');

  response.success(res, 201, post);
};

const destroy = async (req, res) => {
  const result = await postsService.remove(req.params.id);

  if (!result) throwError(404, 'Not Found.');

  response.success(res, 204);
};

module.exports = { show, index, store, update, destroy, pagination };
