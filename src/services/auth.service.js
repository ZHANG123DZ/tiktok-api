const bcrypt = require("bcrypt");
const otpGenerator = require("otp-generator");
const { RefreshToken, User, Email } = require("@/models/index");
const { verifyToken } = require("@/utils/token");
const { Op } = require("sequelize");

class authService {
  async auth(token) {
    const auth = verifyToken(token);
    if (!auth) return null;
    return auth;
  }

  async login(data) {
    const auth = await User.findOne({ where: { email: data?.email } });
    if (!auth) {
      throw new Error("Dang nhap that bai");
    }

    const isMatch = await bcrypt.compare(data.password, auth.password);
    if (!isMatch) {
      throw new Error("Dang nhap that bai");
    }
    delete auth.password;
    return auth.dataValues;
  }

  async register(data) {
    const saltRounds = 10;
    data.password = await bcrypt.hash(data.password, saltRounds);
    const auth = await User.create(data);
    return auth.dataValues;
  }

  //   async sendForgotEmail(id, data) {
  //     const post = await authModel.sendForgotEmail(id, data);
  //     return post;
  //   }

  //   async resetPassword(id) {
  //     const post = await authModel.resetPassword(id);
  //     return post;
  //   }

  //   async setNewPassword(id) {
  //     const post = await authModel.setNewPassword(id);
  //     return post;
  //   }
  async sendCode(data) {
    //Tạo mã OTP
    const otp = otpGenerator.generate(6, {
      digits: true,
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });
    data.otp_code = otp;
    data.expired_at = new Date(Date.now() + 1000 * 60);
    data.type = "verification";
    const code = await Email.create(data);
    return code.dataValues;
  }

  async verifyEmail(data) {
    const auth = await Email.findOne({
      where: {
        email: data.email,
        otp_code: data.code,
        type: "verification",
        expired_at: {
          [Op.gt]: new Date(),
        },
        verified_at: null,
      },
      order: [["created_at", "DESC"]],
    });

    if (!auth) {
      throw new Error("Mã xác thực không tồn tại, sai mã hoặc đã hết hạn.");
    }

    await auth.update({ verified_at: new Date() });

    return auth.dataValues;
  }

  //   async resendVerifyEmail(id) {
  //     const post = await authModel.resendVerifyEmail(id);
  //     return post;
  //   }

  async checkEmail(data) {
    const auth = await User.findOne({
      where: { email: data.email },
    });
    if (!auth) {
      return null;
    }
    return auth.dataValues;
  }

  async checkUsername(data) {
    const auth = await User.findOne({
      where: { username: data.username },
    });
    if (!auth) {
      return null;
    }
    return auth.dataValues;
  }

  async logout(id) {
    return post;
  }
}

module.exports = new authService();
