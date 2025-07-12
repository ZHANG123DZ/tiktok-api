const response = require('@/utils/response');
const { verifyToken } = require('@/utils/token');

module.exports = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return response.error(res, 401, 'Ban chua dang nhap hoặc đăng ký');
  }

  try {
    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    response.error(res, 401, 'Token khong hop le');
  }
};
