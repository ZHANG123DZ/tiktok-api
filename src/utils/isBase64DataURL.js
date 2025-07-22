function isBase64DataURL(str) {
  if (typeof str !== "string") {
    return false;
  }

  return /^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+)?;base64,([a-zA-Z0-9+/=]+)$/.test(
    str
  );
}

module.exports = isBase64DataURL;
