const AdminService = require('@/services/admin.service');

class AdminController {
  login = async (req, res) => {
    try {
      // const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress; // Bỏ dòng này
      const { email, password } = req.body; // Bỏ deviceId, ip

      // Gọi service login không truyền deviceId, ip nữa
      const { admin, token } = await AdminService.login({
        email,
        password,
      });

      // Gắn token vào cookie (HTTP-only để bảo mật)
      res.cookie('admin-token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // chỉ bật secure nếu chạy HTTPS
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 ngày
      });

      return res.json({
        message: 'Đăng nhập thành công',
        admin: { id: admin.id, email: admin.email },
      });
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }
  };

  editProfile = async (req, res) => {
    try {
      const id = req.body.id;
      const admin = await AdminService.editProfile(id, req.body);
      return res.json({ message: 'Cập nhật thành công', admin });
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }
  };

  changePassword = async (req, res) => {
    try {
      const id = req.body.id;
      const admin = await AdminService.changePassword(id, req.body);
      return res.json({ message: 'Đổi mật khẩu thành công', admin });
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }
  };
}

module.exports = new AdminController();
