const tagService = require('@/services/tag.service');

const response = require('@/utils/response');
const throwError = require('@/utils/throwError');

const show = async (req, res) => {
  const name = req.params.name;
  const tag = await tagService.getTag(name);

  if (!tag) throwError(404, 'Not Found.');

  response.success(res, 200, tag);
};

module.exports = {
  show,
};
