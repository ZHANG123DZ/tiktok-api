const { default: slugify } = require("slugify");

const authService = require("@/services/auth.service");

const generateUsernameFromEmail = async (data) => {
  const prefix = data.email?.split("@")[0] || "user";
  let generated = slugify(prefix, { lower: true, strict: true });
  let username = generated;
  let counter = 0;
  try {
    let exists = await authService.checkUsername({ username });
    while (exists) {
      counter++;
      username = `${generated}${counter}`;
      exists = await authService.checkUsername({ username });
    }
    return username;
  } catch {
    return username;
  }
};

module.exports = generateUsernameFromEmail;
