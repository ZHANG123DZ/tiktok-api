// services/admin.service.js

const bcrypt = require('bcrypt');
const { Admin } = require('@/models/index');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.ADMIN_JWT_SECRET;

class AdminService {
  async login({ email, password, deviceId, ip }) {
    // 1️⃣ Tìm admin theo email
    const admin = await Admin.findOne({ where: { email } });
    if (!admin) throw new Error('Email không tồn tại');

    // 2️⃣ Kiểm tra mật khẩu
    // const valid = await bcrypt.compare(password, admin.password);
    // if (!valid) throw new Error('Sai mật khẩu');

    // 3️⃣ Tạo token JWT
    const token = jwt.sign(
      { id: admin.id, deviceId, ip },
      JWT_SECRET,
      { expiresIn: '7d' } // token sống 7 ngày
    );

    // 4️⃣ Trả về admin + token
    return { admin, token };
  }

  async changePassword(id, { oldPassword, newPassword }) {
    const admin = await Admin.findByPk(id);
    if (!admin) throw new Error('Admin không tồn tại');

    const valid = await bcrypt.compare(oldPassword, admin.password);
    if (!valid) throw new Error('Mật khẩu cũ không đúng');

    admin.password = await bcrypt.hash(newPassword, 10);
    await admin.save();
    return admin;
  }

  async editProfile(id, { name, username, email, avatar }) {
    const admin = await Admin.findByPk(id);
    if (!admin) throw new Error('Admin không tồn tại');

    if (username && username !== admin.username) {
      const exists = await Admin.findOne({ where: { username } });
      if (exists) throw new Error('Username đã tồn tại');
      admin.username = username;
    }

    if (email && email !== admin.email) {
      const exists = await Admin.findOne({ where: { email } });
      if (exists) throw new Error('Email đã tồn tại');
      admin.email = email;
    }

    if (name) admin.name = name;
    if (avatar) admin.avatar = avatar;

    await admin.save();
    return admin;
  }
}

module.exports = new AdminService();
