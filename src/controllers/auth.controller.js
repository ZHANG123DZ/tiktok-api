const response = require("@/utils/response");
const throwError = require("@/utils/throwError");

const authService = require("@/services/auth.service");
const { createCookie, readCookie } = require("@/utils/cookie");
const accessToken = require("@/utils/accessToken");

const transporter = require("@/configs/mail");
const loadEmail = require("@/utils/loadEmail");
const queue = require("@/utils/queue");
const { default: slugify } = require("slugify");
const generateUsernameFromEmail = require("@/utils/generateUsernameFromEmail");
const emailToken = require("@/utils/emailToken");
const usersService = require("@/services/user.service");
const forgotPasswordToken = require("@/utils/forgotPasswordToken");

exports.auth = async (req, res) => {
  try {
    const token = readCookie(req, "token");
    if (!token) {
      return response.error(res, 401, "Token không hợp lệ hoặc hết hạn");
    }

    const user = await authService.auth(token);
    if (!user) {
      return response.error(res, 401, "Token không hợp lệ hoặc hết hạn");
    }
    response.success(res, 200, user);
  } catch (error) {
    return response.error(res, 401, "Không xác thực được người dùng này");
  }
};

exports.refreshToken = async (req, res) => {
  try {
    const auth = await authService.refreshToken(req.body);
    const user_agent = req.headers["user_agent"];
    const { email, password, phone, ...data } = auth;
    const token = accessToken.create(data.id);

    if (!token) {
      response.error(res, 500, "Không tạo được token vui lòng đăng nhập lại");
    }
    createCookie(res, "token", token);
    response.success(res, 200, auth);
  } catch (error) {
    response.error(res, 401, "Refresh token that bai");
  }
};

exports.login = async (req, res) => {
  try {
    const user = await authService.login(req.body);
    const token = accessToken.create({ sub: user.id });
    if (!token) {
      return response.error(
        res,
        500,
        "Không tạo được token vui lòng đăng nhập lại"
      );
    }

    createCookie(res, "token", token);
    response.success(res, 200, user);
  } catch (error) {
    response.error(res, 401, "Dang nhap that bai");
  }
};

exports.checkUsername = async (req, res) => {
  const data = req.body;

  const auth = await authService.checkUsername(data);
  if (auth) {
    return response.success(res, 200, auth);
  }
  response.error(res, 409);
};

exports.register = async (req, res) => {
  const { ...data } = req.body;
  try {
    //auto generate userID
    if (!data.username) {
      const username = await generateUsernameFromEmail(data);
      data.username = username;
    }
    const user = await authService.register(data);
    const token = accessToken.create({ sub: user.id });
    if (!token) {
      return response.error(res, 500, "Không tạo được token vui lòng thử lại");
    }

    queue.dispatch("sendVerifyEmailJob", {
      userId: user.id,
    });

    createCookie(res, "token", token);
    response.success(res, 200, user);
  } catch (error) {
    console.log(error);
    response.error(res, 401, "Dang ky that bai");
  }
};

exports.sendForgotEmail = async (req, res) => {
  const data = req.body;
  try {
    const user = await authService.sendForgotEmail(data.email);
    const token = forgotPasswordToken.create({ sub: user.id });

    queue.dispatch("sendForgotPasswordJob", {
      userId: user.id,
      email: user.email,
      token,
    });
    return response.success(res, 200, user);
  } catch (error) {
    console.log(error);
    return response.error(res, 401, "Thông tin email không đúng!");
  }
};

exports.resetPassword = async (req, res) => {
  const data = req.body;

  if (!data) {
    return response.error(res, 401, "Không xác thực được người dùng");
  }
  try {
    const payload = forgotPasswordToken.verify(data.token);

    const user = await authService.resetPassword(payload.sub, data.password);
    return response.success(res, 200, user, "Đổi mật khẩu thành công");
  } catch (error) {
    console.log(error);
    return response.error(res, 401);
  }
};

// exports.showNewPasswordForm = async (req, res) => {
//   res.render('admin/auth/new-password', { layout: false });
// };

// exports.setNewPassword = async (req, res) => {
//   const loginData = await authService.setNewPassword();
//   res.redirect('/admin/new-password');
// };

// exports.showVerifyNotice = async (req, res) => {
//   res.render('admin/auth/verify-email', { layout: false });
// };

exports.sendCode = async (req, res) => {
  const data = req.body;
  try {
    const auth = await authService.sendCode(data);
    if (auth.otp_code !== "") {
      queue.dispatch("sendCodeJob", auth);
    }
    response.success(res, 200);
  } catch (error) {
    console.log(error);
    response.error(res, 401, "Không xác thực được người dùng này");
  }
};
//
exports.verifyEmail = async (req, res) => {
  const { token } = req.body;
  if (!token) {
    return response.error(res, 400, "Thiếu mã xác thực");
  }
  try {
    const payload = emailToken.verify(token);
    const user = await usersService.getByKey(payload.sub);
    if (!user) return response.error(res, 401);
    await usersService.update(user.id, { verified_at: new Date() });
    response.success(res, 200, user);
  } catch (error) {
    response.error(res, 401, error);
  }
};

// exports.verifyEmail = async (req, res) => {
//   const data = req.body;
//   try {
//     const auth = await authService.verifyEmail(data);
//     if (auth.otp_code !== data.code) {
//       response.error(res, 401);
//     }
//     if (auth.expired_at && new Date() > new Date(auth.expired_at)) {
//       response.error(res, 401);
//     }
//     response.success(res, 200, auth);
//   } catch (error) {
//     response.error(res, 401, error);
//   }
// };

exports.checkEmail = async (req, res) => {
  const data = req.body;

  const auth = await authService.checkEmail(data);
  if (auth) {
    return response.success(res, 200, auth);
  }
  response.error(res, 409);
};

exports.logout = async (req, res) => {
  const token = readCookie(req, "token");
  const data = await authService.auth(token);
  const newToken = accessToken.create(data, { expiresIn: "1s" });
  createCookie(res, "token", newToken, { maxAge: 1000 });
  response.success(res, 200);
};
