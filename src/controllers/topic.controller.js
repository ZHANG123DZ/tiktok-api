const topicService = require('@/services/topic.service');
const response = require('@/utils/response');
const throwError = require('@/utils/throwError');

const index = async (req, res) => {
  const topics = await topicService.getAll();
  if (!topics) throwError(404, 'Not Found.');

  response.success(res, 200, topics);
};

const show = async (req, res) => {
  const slug = req.params.slug;
  const userId = req.user?.id;

  const topic = await topicService.getById(slug, userId);
  if (!topic) throwError(404, 'Not Found.');

  response.success(res, 200, topic);
};

module.exports = {
  show,
  index,
};
