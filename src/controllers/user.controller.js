const usersService = require("@/services/user.service");

const response = require("@/utils/response");
const throwError = require("@/utils/throwError");

const index = async (req, res) => {
  const { page, limit } = req;
  const { items, total } = await usersService.getAll(page, limit);
  res.paginate({ items, total });
};

const show = async (req, res) => {
  const username = req.params.key;
  try {
    const user = await usersService.getByKey(username);
    response.success(res, 200, user);
  } catch (error) {
    console.log(error);
    response.error(res, 404, "Không tìm thấy người dùng này");
  }
};

const getUserPosts = async (req, res) => {
  const username = req.params.key;
  const { page, limit } = req;
  const { items, total } = await usersService.getUserPosts(
    username,
    page,
    limit
  );
  res.paginate({ items, total });
};

const store = async (req, res) => {
  const user = await usersService.create(req.body);
  response.success(res, 201, user);
};

const update = async (req, res) => {
  const user = await usersService.update(req.params.key, req.body);

  if (!user) throwError(404, "Not Found.");

  response.success(res, 201, user);
};

const destroy = async (req, res) => {
  const result = await usersService.remove(req.params.key);

  if (!result) throwError(404, "Not Found.");

  response.success(res, 204);
};

module.exports = { show, index, store, update, destroy, getUserPosts };
