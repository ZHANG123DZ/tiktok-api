class Cookie {
  createCookie = (res, key, value, options = {}) => {
    const defaultOptions = {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 24 * 60 * 60 * 1000,
    };

    res.cookie(key, value, { ...defaultOptions, ...options });
  };

  readCookie = (req, key) => {
    if (!req.cookies || !req.cookies[key]) return null;
    return req.cookies[key];
  };

  clearCookie = (res, key, options = {}) => {
    const defaultOptions = {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    };

    res.clearCookie(key, { ...defaultOptions, ...options });
  };
}

module.exports = new Cookie();
