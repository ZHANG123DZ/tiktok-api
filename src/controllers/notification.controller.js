const notificationService = require("@/services/notification.service");
const response = require("@/utils/response");

const getNotify = async (req, res) => {
  const currentUserId = req.user?.id;
  const { page, limit } = req;
  try {
    const notification = await notificationService.getNotify(
      page,
      limit,
      currentUserId
    );
    return response.success(res, 200, notification);
  } catch (error) {
    return response.error(res, 404, error);
  }
};

const update = async (req, res) => {
  const data = req.body;
  const id = req.params.id;
  console.log(id);
  try {
    const notification = await notificationService.update(data, id);
    return response.success(res, 200, notification);
  } catch (error) {
    return response.error(res, 404, error);
  }
};

module.exports = { getNotify, update };
