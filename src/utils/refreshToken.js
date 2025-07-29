const jwt = require("jsonwebtoken");

class refreshToken {
  create = (payload, options = {}) => {
    try {
      return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: process.env.REFRESH_TOKEN_LIFETIME,
        ...options,
      });
    } catch (error) {
      return null;
    }
  };

  verify = (token) => {
    try {
      return jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
    } catch (error) {
      return null;
    }
  };
}

module.exports = new refreshToken();
