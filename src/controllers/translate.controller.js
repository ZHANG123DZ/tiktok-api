const musicService = require('@/services/music.service');
const translateService = require('@/services/translate.service');

const response = require('@/utils/response');
const throwError = require('@/utils/throwError');

const translate = async (req, res) => {
  const text = req.body.content;
  const music = await translateService.translate(text);

  if (!music) throwError(404, 'Not Found.');

  response.success(res, 200, music);
};

module.exports = {
  translate,
};
