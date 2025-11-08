const response = require('@/utils/response');
const qs = require('qs');
const crypto = require('crypto');
const authService = require('@/services/auth.service');
const { createCookie, readCookie } = require('@/utils/cookie');
const accessToken = require('@/utils/accessToken');
const refreshToken = require('@/utils/refreshToken');

const queue = require('@/utils/queue');
const userService = require('@/services/user.service');
const forgotPasswordToken = require('@/utils/forgotPasswordToken');
const { default: axios } = require('axios');

const auth = async (req, res) => {
  try {
    const token = readCookie(req, 'token');
    if (!token) {
      return response.error(res, 401, 'Token không hợp lệ hoặc hết hạn');
    }

    const user = await authService.auth(token);
    if (!user) {
      return response.error(res, 401, 'Token không hợp lệ hoặc hết hạn');
    }
    return response.success(res, 200, user);
  } catch (error) {
    return response.error(res, 401, 'Không xác thực được người dùng này');
  }
};

const refreshTok = async (req, res) => {
  try {
    const refreshTok = readCookie(req, 'refresh-token');
    const user = await authService.refreshTok(refreshTok);
    const newAccessToken = accessToken.create({ sub: user.id });
    const newRefreshToken = refreshToken.create({ sub: user.id });

    if (!newRefreshToken || !newAccessToken) {
      response.error(res, 500, 'Không tạo được token vui lòng đăng nhập lại');
    }
    createCookie(res, 'token', newAccessToken);
    createCookie(res, 'refresh-token', newRefreshToken);
    return response.success(res, 200, 'Refresh Token thành công');
  } catch (error) {
    return response.error(res, 401, 'Refresh token that bai');
  }
};

const login = async (req, res) => {
  try {
    const data = req.body;
    const user = await authService.login(data);
    const token = accessToken.create({ sub: user.id });
    const refreshTok = refreshToken.create({ sub: user.id });
    if (!refreshTok) {
      response.error(
        res,
        500,
        'Không tạo được refresh token vui lòng đăng nhập lại'
      );
    }
    createCookie(res, 'refresh-token', refreshTok);

    if (!token) {
      return response.error(
        res,
        500,
        'Không tạo được token vui lòng đăng nhập lại'
      );
    }
    createCookie(res, 'token', token);
    return response.success(res, 200, user);
  } catch (error) {
    return response.error(res, 401, 'Dang nhap that bai');
  }
};

const checkUsername = async (req, res) => {
  const { username } = req.body;
  const auth = await authService.checkUsername(username);
  if (auth) {
    return response.success(res, 200, auth);
  }
  response.error(res, 409);
};

const register = async (req, res) => {
  const { ...data } = req.body;
  try {
    const user = await authService.register(data);
    const token = accessToken.create({ sub: user.id });
    const refreshTok = refreshToken.create({ sub: user.id });
    if (!token) {
      return response.error(res, 500, 'Không tạo được token vui lòng thử lại');
    }

    queue.dispatch('sendVerifyEmailJob', {
      userId: user.id,
    });

    createCookie(res, 'token', token);
    createCookie(res, 'refresh-token', refreshTok);
    return response.success(res, 200, user);
  } catch (error) {
    console.log(error);
    return response.error(res, 401, 'Dang ky that bai');
  }
};

const social = async (req, res) => {
  const { social } = req.params;
  const { code } = req.body;
  try {
    let tokenResponse, userInfo;

    if (social === 'google') {
      tokenResponse = await axios.post(
        'https://oauth2.googleapis.com/token',
        qs.stringify({
          client_id: process.env.GOOGLE_CLIENT_ID,
          client_secret: process.env.GOOGLE_CLIENT_SECRET,
          redirect_uri: String(process.env.GOOGLE_REDIRECT_URI),
          grant_type: 'authorization_code',
          code,
        }),
        { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
      );
      const { access_token, id_token } = tokenResponse.data;

      userInfo = await axios.get(
        'https://www.googleapis.com/oauth2/v3/userinfo',
        {
          headers: { Authorization: `Bearer ${access_token}` },
        }
      );
    }

    if (social === 'facebook') {
      tokenResponse = await axios.get(
        'https://graph.facebook.com/v12.0/oauth/access_token',
        {
          params: {
            client_id: process.env.FACEBOOK_APP_ID,
            client_secret: process.env.FACEBOOK_APP_SECRET,
            redirect_uri: process.env.FACEBOOK_REDIRECT_URI,
            code,
          },
        }
      );

      const { access_token } = tokenResponse.data;
      userInfo = await axios.get('https://graph.facebook.com/me', {
        params: { fields: 'id,name,email', access_token },
      });
    }
    const emailData = userInfo.data;
    let user;
    const exitsEmail = await authService.checkEmail(emailData.email);
    if (!exitsEmail) {
      const pass = Array.from(
        crypto.getRandomValues(new Uint8Array(12)),
        (b) =>
          'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+'[
            b % 74
          ]
      ).join('');
      user = await authService.register({
        name: emailData.name,
        password: pass,
        avatar: emailData.picture,
        email: emailData.email,
      });
    } else {
      user = await authService.login({ email: emailData.email }, true);
    }

    const token = accessToken.create({ sub: user.id });
    const refreshTok = refreshToken.create({ sub: user.id });
    if (!token) {
      return response.error(res, 500, 'Không tạo được token vui lòng thử lại');
    }

    createCookie(res, 'token', token);
    createCookie(res, 'refresh-token', refreshTok);
    return response.success(res, 200, user);
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ success: false, message: 'Social login failed' });
  }
};

const sendForgotPassword = async (req, res) => {
  const data = req.body;
  try {
    const user = await authService.sendForgotPassword(data.email);
    const token = forgotPasswordToken.create({ sub: user.id });

    queue.dispatch('sendForgotPasswordJob', {
      userId: user.id,
      email: user.email,
      token,
    });
    return response.success(res, 200, user);
  } catch (error) {
    console.log(error);
    return response.error(res, 401, 'Thông tin email không đúng!');
  }
};

const resetPassword = async (req, res) => {
  const { email, phone, password } = req.body;

  if ((!email && !phone) || !password) {
    return response.error(
      res,
      400,
      'Thiếu dữ liệu (email/phone hoặc password)'
    );
  }

  try {
    const identifier = email || phone;
    const user = await authService.resetPassword(identifier, password);

    return response.success(res, 200, user, 'Đổi mật khẩu thành công');
  } catch (error) {
    console.error(error);
    return response.error(res, 401, 'Không thể đổi mật khẩu');
  }
};

const changePassword = async (req, res) => {
  const data = req.body;
  const userId = req.user.id;
  try {
    const result = await authService.changePassword(userId, data);
    return response.success(res, 200, result);
  } catch (error) {
    console.log(error);
    response.error(res, 401, error);
  }
};

const editProfile = async (req, res) => {
  const user = req.user;
  const userId = user.id;
  const data = req.body;

  try {
    const result = await authService.editProfile(userId, data);
    return response.success(res, 200, result);
  } catch (error) {
    console.log(error);
    return response.error(res, 401, error);
  }
};

const userSetting = async (req, res) => {
  const user = req.user;

  try {
    const result = await authService.userSetting(user.id);
    return response.success(res, 200, result);
  } catch (error) {
    console.log(error);
    return response.error(res, 401, error);
  }
};

const settings = async (req, res) => {
  const user = req.user;
  const data = req.body;

  try {
    const result = await authService.settings(user.id, data);
    return response.success(res, 200, result);
  } catch (error) {
    console.log(error);
    return response.error(res, 401, error);
  }
};

const sendCode = async (req, res) => {
  const data = req.body;
  const target = data.target;
  const { method } = req.query;
  const userId = req.user?.id;
  try {
    const auth = await authService.sendCode({ data, target, userId });

    if (target.includes('@')) {
      auth.email = target;
    } else {
      auth.phone = '+84' + target.slice(1);
    }
    if (
      auth.code !== '' &&
      method === 'email' &&
      data.action === 'verify_email'
    ) {
      queue.dispatch('sendEmailCodeJob', auth);
    }
    if (
      auth.code !== '' &&
      method === 'phone' &&
      data.action === 'verify_email'
    ) {
      queue.dispatch('sendPhoneCodeJob', auth);
    }
    if (
      auth.code !== '' &&
      method === 'email' &&
      data.action === 'reset_password_by_email'
    ) {
      queue.dispatch('sendResetPasswordCodeEmailJob', auth);
    }
    response.success(res, 200);
  } catch (error) {
    console.log(error);
    response.error(res, 401, 'Không xác thực được người dùng này');
  }
};

const verifyCode = async (req, res) => {
  const { email, phone, action, code } = req.body;

  try {
    await authService.verifyCode({ email, action, code });
    response.success(res, 200);
  } catch (error) {
    response.error(res, 401, error);
  }
};

const verifyEmail = async (req, res) => {
  try {
    await verifyCode(req, res);
    await userService.update(user.id, { verifiedAt: new Date() });
    response.success(res, 200, user);
  } catch (error) {
    response.error(res, 401, error);
  }
};

const checkEmail = async (req, res) => {
  const { email } = req.body;
  try {
    const auth = await authService.checkEmail(email);
    return response.success(res, 200, auth);
  } catch (error) {
    return response.error(res, 409, error);
  }
};

const checkPhone = async (req, res) => {
  const { phone } = req.body;
  try {
    const auth = await authService.checkPhone(phone);
    return response.success(res, 200, auth);
  } catch (error) {
    return response.error(res, 409, error);
  }
};

const logout = async (req, res) => {
  const token = readCookie(req, 'token');
  const data = await authService.auth(token);
  const newToken = accessToken.create(data, { expiresIn: '1s' });
  const newRefreshToken = refreshToken.create(data, { expiresIn: '1s' });
  createCookie(res, 'token', newToken, { maxAge: 1000 });
  createCookie(res, 'refresh-token', newRefreshToken, { maxAge: 1000 });
  response.success(res, 200);
};

module.exports = {
  login,
  register,
  logout,
  checkEmail,
  checkUsername,
  checkPhone,
  editProfile,
  changePassword,
  settings,
  userSetting,
  resetPassword,
  auth,
  sendCode,
  verifyCode,
  verifyEmail,
  sendForgotPassword,
  refreshTok,
  social,
};
