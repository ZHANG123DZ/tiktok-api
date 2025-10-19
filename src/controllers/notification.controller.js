const notificationService = require('@/services/notification.service');
const response = require('@/utils/response');

const getAllNotify = async (req, res) => {
  const currentUserId = req.user?.id;
  const { page, limit } = req;
  try {
    const notifications = await notificationService.getAllNotify(
      page,
      limit,
      currentUserId
    );
    return response.success(res, 200, notifications);
  } catch (error) {
    return response.error(res, 404, error);
  }
};

const getAllNotifyByType = async (req, res) => {
  const userId = req.user?.id;
  const type = req.params.type;
  const { page, limit } = req;
  try {
    const notification = await notificationService.getAllNotifyByType(
      page,
      limit,
      userId,
      type
    );
    return response.success(res, 200, notification);
  } catch (error) {
    return response.error(res, 404, error);
  }
};

const update = async (req, res) => {
  const data = req.body;
  const id = req.params.id;

  try {
    const notification = await notificationService.update(data, id);
    return response.success(res, 200, notification);
  } catch (error) {
    return response.error(res, 404, error);
  }
};

const readAll = async (req, res) => {
  const userId = req.user.id;

  try {
    const notification = await notificationService.readAll(userId);
    return response.success(res, 200, notification);
  } catch (error) {
    return response.error(res, 404, error);
  }
};

module.exports = { getAllNotify, update, readAll, getAllNotifyByType };
