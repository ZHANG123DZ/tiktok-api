const jwt = require('jsonwebtoken');
const { Admin } = require('@/models');

const JWT_SECRET = process.env.ADMIN_JWT_SECRET;

module.exports = async (req, res, next) => {
  try {
    // 1️⃣ Lấy token từ cookie
    const token = req.cookies['admin-token'];
    if (!token) {
      return res.status(401).json({ error: 'Thiếu token đăng nhập admin' });
    }

    // 2️⃣ Xác thực token
    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      return res
        .status(401)
        .json({ error: 'Token không hợp lệ hoặc đã hết hạn' });
    }

    // 3️⃣ Tìm admin trong database
    const admin = await Admin.findByPk(decoded.id);
    if (!admin) {
      return res
        .status(401)
        .json({ error: 'Admin không tồn tại hoặc đã bị xoá' });
    }

    // 4️⃣ Gắn thông tin admin vào request để dùng ở các route sau
    req.admin = admin;
    req.tokenData = decoded;

    // ✅ Nếu mọi thứ ok, cho phép đi tiếp
    next();
  } catch (err) {
    console.error('Lỗi ở adminMiddleware:', err);
    return res
      .status(500)
      .json({ error: 'Lỗi máy chủ trong quá trình xác thực admin' });
  }
};
