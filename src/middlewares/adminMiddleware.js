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

    // 3️⃣ Kiểm tra thông tin thiết bị
    if (!decoded.deviceId) {
      return res
        .status(400)
        .json({ error: 'Thiếu thông tin thiết bị (deviceId)' });
    }

    // 4️⃣ (Tuỳ chọn) Kiểm tra IP nếu bạn muốn ràng buộc IP
    const requestIp =
      req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    if (decoded.ip && decoded.ip !== requestIp) {
      // Bạn có thể log cảnh báo thay vì reject cứng:
      console.warn(
        `⚠️ Admin ${decoded.id} có IP thay đổi: ${decoded.ip} -> ${requestIp}`
      );
      // return res.status(400).json({ error: 'Địa chỉ IP không hợp lệ' });
    }

    // 5️⃣ Tìm admin trong database
    const admin = await Admin.findByPk(decoded.id);
    if (!admin) {
      return res
        .status(401)
        .json({ error: 'Admin không tồn tại hoặc đã bị xoá' });
    }

    // 6️⃣ Gắn thông tin admin & token vào request để dùng ở các route sau
    req.admin = admin;
    req.deviceId = decoded.deviceId;
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
