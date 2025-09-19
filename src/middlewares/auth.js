const accessToken = require('@/utils/accessToken');
const { User } = require('@/models');

module.exports = async (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    req.user = null;
    return next();
  }

  try {
    const decoded = accessToken.verify(token);
    const user = await User.findByPk(decoded?.sub);
    const userData = user?.dataValues;

    if (
      !userData ||
      userData.status === 'banned' ||
      userData.status === 'inactive'
    ) {
      req.user = null;
      return next();
    }

    req.user = userData;
    return next();
  } catch (error) {
    console.error(error);
    req.user = null;
    return next();
  }
};
