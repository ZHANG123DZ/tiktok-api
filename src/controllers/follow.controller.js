const followsService = require("@/services/follow.service");
const response = require("@/utils/response");

const getFollowers = async (req, res) => {
  const { type, id } = req.params;
  const { page, limit } = req;

  try {
    const results = await followsService.getFollowers(type, id);
    return response.success(res, 200, results);
  } catch (error) {
    console.log(error);
    return response.error(
      res,
      400,
      "Lấy danh sách những người theo dõi thất bại"
    );
  }
};

const getFollowing = async (req, res) => {
  const { type, id } = req.params;
  try {
    const results = await followsService.getFollowing(id, type);
    return response.success(res, 200, results);
  } catch (error) {
    console.log(error);
    return response.error(
      res,
      400,
      "Lấy danh sách những người đang theo dõi thất bại"
    );
  }
};

const follow = async (req, res) => {
  const { type, id } = req.params;
  const user = req.user;
  try {
    await followsService.follow(user.id, type, id);
    return response.success(res, 200, "Đã theo dõi thành công");
  } catch (error) {
    console.log(error);
    return response.error(res, 400, "Theo dõi thất bại");
  }
};

const unfollow = async (req, res) => {
  const { type, id } = req.params;
  const user = req.user;
  try {
    await followsService.unfollow(user.id, type, id);
    return response.success(res, 204, "Đã hủy theo dõi thành công");
  } catch (error) {
    console.log(error);
    return response.error(res, 400, "Hủy theo dõi thất bại");
  }
};

const check = async (req, res) => {
  const { type, id } = req.params;
  const user = req.user;
  try {
    const isFollowing = await followsService.check(user.id, type, id);
    return response.success(res, 200, isFollowing);
  } catch (error) {
    console.log(error);
    return response.error(res, 400, "Lỗi kiểm tra trạng thái theo dõi");
  }
};

module.exports = {
  getFollowers,
  getFollowing,
  follow,
  unfollow,
  check,
};
