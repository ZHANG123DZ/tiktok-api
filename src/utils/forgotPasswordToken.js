const jwt = require("jsonwebtoken");

class forgotPasswordToken {
  create = (payload, options = {}) => {
    try {
      return jwt.sign(payload, process.env.JWT_FORGOT_PASSWORD_SECRET, {
        expiresIn: process.env.JWT_FORGOT_PASSWORD_EXPIRES_IN,
        ...options,
      });
    } catch (error) {
      return null;
    }
  };

  verify = (token) => {
    try {
      return jwt.verify(token, process.env.JWT_FORGOT_PASSWORD_SECRET);
    } catch (error) {
      return null;
    }
  };
}

module.exports = new forgotPasswordToken();
