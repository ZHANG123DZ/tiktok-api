const jwt = require("jsonwebtoken");

class EmailToken {
  create = (payload, options = {}) => {
    try {
      return jwt.sign(payload, process.env.JWT_VERIFY_SECRET, {
        expiresIn: process.env.JWT_VERIFY_EXPIRES_IN,
        ...options,
      });
    } catch (error) {
      return null;
    }
  };

  verify = (token) => {
    try {
      return jwt.verify(token, process.env.JWT_VERIFY_SECRET);
    } catch (error) {
      return null;
    }
  };
}

module.exports = new EmailToken();
