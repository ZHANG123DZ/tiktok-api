const response = require("@/utils/response");
const throwError = require("@/utils/throwError");

const authService = require("@/services/auth.service");
const { createCookie, readCookie } = require("@/utils/cookie");
const { createToken } = require("@/utils/token");

const transporter = require("@/configs/mail");
const loadEmail = require("@/utils/loadEmail");
const queue = require("@/utils/queue");
const { default: slugify } = require("slugify");
const generateUsernameFromEmail = require("@/utils/generateUsernameFromEmail");

exports.auth = async (req, res) => {
  try {
    const token = readCookie(req, "token");
    console.log(token);
    if (!token) {
      return response.error(res, 401, "Token không hợp lệ hoặc hết hạn");
    }

    const data = await authService.auth(token);
    if (!data) {
      return response.error(res, 401, "Token không hợp lệ hoặc hết hạn");
    }
    const user_agent = req.headers["user_agent"];
    if (user_agent !== data.user_agent) response.error(res, 401);
  } catch (error) {
    return response.error(res, 401, "Không xác thực được người dùng này");
  }
};

exports.refreshToken = async (req, res) => {
  try {
    const auth = await authService.refreshToken(req.body);
    const user_agent = req.headers["user_agent"];
    const { email, password, phone, ...data } = auth;
    const token = createToken(data);

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
    const auth = await authService.login(req.body);
    const { email, password, phone, ...data } = auth;
    const user_agent = req.headers["user_agent"];
    data.user_agent = user_agent;
    const token = createToken(data);
    if (!token) {
      return response.error(
        res,
        500,
        "Không tạo được token vui lòng đăng nhập lại"
      );
    }
    createCookie(res, "token", token);
    response.success(res, 200, auth);
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
    const auth = await authService.register(data);
    const { email, password, phone, ...rest } = auth;
    const user_agent = req.headers["user_agent"] || "unknown";
    rest.user_agent = user_agent;
    const token = createToken(rest);
    if (!token) {
      return response.error(
        res,
        500,
        "Không tạo được token vui lòng đăng nhập"
      );
    }
    createCookie(res, "token", token);
    response.success(res, 200, auth);
  } catch (error) {
    response.error(res, 401, "Dang ky that bai");
  }
};

// exports.showForgotForm = async (req, res) => {
//   res.render('admin/auth/forgot-password', { layout: false });
// };

// exports.sendForgotEmail = async (req, res) => {
//   const loginData = await authService.sendForgotEmail();
//   res.redirect('/admin/forgot-password');
// };

// exports.showResetForm = async (req, res) => {
//   res.render('admin/auth/reset-password', { layout: false });
// };

// exports.resetPassword = async (req, res) => {
//   const loginData = await authService.resetPassword();
//   res.redirect('/admin/reset-password');
// };

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

exports.verifyEmail = async (req, res) => {
  const data = req.body;
  try {
    const auth = await authService.verifyEmail(data);
    if (auth.otp_code !== data.code) {
      response.error(res, 401);
    }
    if (auth.expired_at && new Date() > new Date(auth.expired_at)) {
      response.error(res, 401);
    }
    response.success(res, 200, auth);
  } catch (error) {
    response.error(res, 401, error);
  }
};

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
  const newToken = createToken(data, { expiresIn: "1s" });
  createCookie(res, "token", newToken, { maxAge: 1000 });
  response.success(res, 200);
};
