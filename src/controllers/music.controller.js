const musicService = require('@/services/music.service');

const response = require('@/utils/response');
const throwError = require('@/utils/throwError');

const show = async (req, res) => {
  const id = req.params.id;
  const music = await musicService.getMusic(id);

  if (!music) throwError(404, 'Not Found.');

  response.success(res, 200, music);
};

module.exports = {
  show,
};
