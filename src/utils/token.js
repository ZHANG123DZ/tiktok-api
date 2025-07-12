const jwt = require('jsonwebtoken');

class Token {
  createToken = (payload, options = {}) => {
    try {
      return jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
        ...options,
      });
    } catch (error) {
      return null;
    }
  };

  verifyToken = (token) => {
    try {
      return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      return null;
    }
  };
}

module.exports = new Token();
