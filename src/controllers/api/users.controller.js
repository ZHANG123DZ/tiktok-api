const usersService = require('@/services/users.service');
const { success } = require('@/utils/response');

exports.index = async (req, res) => {
  const users = await usersService.getAll();
  success(res, 200, users);
};

exports.create = async (req, res) => {
  const data = req.body;
  const users = await usersService.create(data);
  success(res, 200, users);
};

exports.show = async (req, res) => {
  const data = req.params.username;
  const user = await usersService.findById(data);
  success(res, 200, user);
};

exports.update = async (req, res) => {
  const data = req.params.username;
  const user = await usersService.update(data);
  console.log(user);
  success(res, 200, user);
};

exports.destroy = async (req, res) => {
  const id = req.params.id;
  const user = await usersService.remove(id);
  console.log(user);
  success(res, 200, user);
};
