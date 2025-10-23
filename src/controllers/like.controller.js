const likesService = require('@/services/like.service');
const response = require('@/utils/response');

const getLikes = async (req, res) => {
  const { type, id } = req.params;

  try {
    const results = await likesService.getLikes(type, id);
    return response.success(res, 200, results);
  } catch (error) {
    console.log(error);
    return response.error(res, 400, 'Lấy danh sách những người thích thất bại');
  }
};

const getLikedUserId = async (req, res) => {
  const { type, id } = req.params;

  try {
    const results = await likesService.getLikedUserId(id, type);
    return response.success(res, 200, results);
  } catch (error) {
    console.log(error);
    return response.error(
      res,
      400,
      'Lấy danh sách những người đang thích thất bại'
    );
  }
};

const like = async (req, res) => {
  const { type, id } = req.params;
  const user = req.user;
  try {
    await likesService.like(user.id, type, id);
    return response.success(res, 200, 'Đã thích thành công');
  } catch (error) {
    console.log(error);
    return response.error(res, 400, 'thích thất bại');
  }
};

const unlike = async (req, res) => {
  const { type, id } = req.params;
  const user = req.user;
  try {
    await likesService.unlike(user.id, type, id);
    return response.success(res, 204, 'Đã hủy thích thành công');
  } catch (error) {
    console.log(error);
    return response.error(res, 400, 'Hủy thích thất bại');
  }
};

const check = async (req, res) => {
  const { type, id } = req.params;
  const user = req.user;
  try {
    const isLike = await likesService.check(user.id, type, id);
    return response.success(res, 200, isLike);
  } catch (error) {
    console.log(error);
    return response.error(res, 400, 'Lỗi kiểm tra trạng thái thích');
  }
};

module.exports = {
  getLikes,
  getLikedUserId,
  like,
  unlike,
  check,
};
