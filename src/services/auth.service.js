const bcrypt = require('bcrypt');
const otpGenerator = require('otp-generator');
const {
  User,
  Email,
  VerificationCode,
  UserSetting,
} = require('@/models/index');
const accessToken = require('@/utils/accessToken');
const { Op } = require('sequelize');
const generateUsername = require('@/utils/generateUsername');
const refreshToken = require('@/utils/refreshToken');
const toDate = require('@/utils/toDate');
const getExpiry = require('@/utils/getExpiry');

class authService {
  async auth(token) {
    const auth = accessToken.verify(token);
    if (!auth) return null;
    const user = await User.findOne({
      where: { id: auth.sub },
      attributes: [
        'id',
        'email',
        'username',
        'name',
        'firstName',
        'lastName',
        'avatar',
        'bio',
        'followerCount',
        'followingCount',
        'postCount',
        'likeCount',
        'createdAt',
        'twoFactorEnabled',
        'verifiedAt',
      ],
    });
    return user;
  }
  async refreshTok(token) {
    const auth = refreshToken.verify(token);
    if (!auth) return null;
    try {
      const user = await User.findOne({
        where: { id: auth.sub },
        attributes: ['id'],
      });
      return user;
    } catch (err) {
      throw new Error(err);
    }
  }

  async login(data) {
    const auth = await User.findOne({ where: { email: data?.email } });
    if (!auth) {
      throw new Error('Dang nhap that bai');
    }

    const isMatch = await bcrypt.compare(data.password, auth.password);
    if (!isMatch) {
      throw new Error('Dang nhap that bai');
    }
    delete auth.password;
    return auth.dataValues;
  }

  async register(data) {
    const saltRounds = 10;
    const {
      username,
      email,
      phone,
      name,
      password,
      firstName,
      lastName,
      day,
      month,
      year,
    } = data;
    data.password = await bcrypt.hash(password, saltRounds);
    data.birthday = toDate(day, month, year);
    if (!username) {
      const identifier = email || phone;
      const username = await generateUsername(identifier);
      data.username = username;
    }

    if (!name) {
      const name = data.username;
      data.name = name;
    }

    const auth = await User.create(data);
    await UserSetting.create({ userId: auth.dataValues.id });
    return auth.dataValues;
  }

  async editProfile(userId, data) {
    const user = await User.update(data, { where: { id: userId } });
    return user.dataValues;
  }

  async userSetting(id) {
    const userSetting = await UserSetting.findOne({ where: { userId: id } });
    return userSetting.dataValues;
  }

  async settings(id, data) {
    const user = await UserSetting.update(data, { where: { userId: id } });
    return user.dataValues;
  }

  async sendForgotPassword(email) {
    const user = await User.findOne({ where: { email } });
    return user.dataValues;
  }

  async resetPassword(identifier, password) {
    const saltRounds = 10;
    const newPassword = await bcrypt.hash(password, saltRounds);

    const [updatedCount] = await User.update(
      { password: newPassword },
      {
        where: {
          [Op.or]: [{ email: identifier }, { phone: identifier }],
        },
      }
    );

    if (updatedCount === 0) {
      throw new Error('Không tìm thấy user với email hoặc phone này');
    }

    const user = await User.findOne({
      where: {
        [Op.or]: [{ email: identifier }, { phone: identifier }],
      },
      attributes: { exclude: ['password'] },
    });

    return user;
  }

  async changePassword(userId, data) {
    const { currentPassword, newPassword } = data;

    const curUser = await User.findOne({ where: { id: userId } });
    if (!curUser) {
      throw new Error('User không tồn tại');
    }

    const isMatch = await bcrypt.compare(currentPassword, curUser.password);
    if (!isMatch) {
      throw new Error('Mật khẩu hiện tại không chính xác');
    }

    const saltRounds = 10;
    const newHashedPass = await bcrypt.hash(newPassword, saltRounds);

    await User.update({ password: newHashedPass }, { where: { id: userId } });

    return { success: true, message: 'Đổi mật khẩu thành công' };
  }

  async sendCode({ data, target, userId }) {
    const { action } = data;
    const codeOtp = otpGenerator.generate(6, {
      digits: true,
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });
    const expiresAt = getExpiry(action);
    const code = await VerificationCode.create({
      code: codeOtp,
      expiresAt,
      userId,
      action,
      target,
    });
    return code.dataValues;
  }

  async verifyCode({ target, action, code }) {
    const record = await VerificationCode.findOne({
      where: {
        target,
        action,
        code,
        expiresAt: {
          [Op.gt]: new Date(),
        },
      },
      order: [['createdAt', 'DESC']],
    });

    if (!record) throw new Error('Mã không hợp lệ');
    if (record.usedAt) throw new Error('Mã đã được sử dụng');
    if (record.expiresAt < new Date()) throw new Error('Mã đã hết hạn');

    record.usedAt = new Date();
    await record.save();
    return true;
  }

  async checkEmail(email) {
    const exits = await User.findOne({
      where: { email },
    });
    if (!exits) {
      return false;
    }
    return true;
  }

  async checkUsername(username) {
    const auth = await User.findOne({
      where: { username },
    });
    if (!auth) {
      return null;
    }
    return auth.dataValues;
  }

  async checkPhone(phone) {
    const auth = await User.findOne({
      where: { phone },
    });
    if (!auth) {
      return null;
    }
    return auth.dataValues;
  }
}

module.exports = new authService();
