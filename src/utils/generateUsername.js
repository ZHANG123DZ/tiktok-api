const { default: slugify } = require('slugify');

const generateUsername = async (data) => {
  const prefix = data?.split('@')[0] || 'user';
  let generated = slugify(prefix, { lower: true, strict: true });
  let username = generated;
  let counter = 0;
  try {
    let exists = await User.findOne({
      where: { username },
    });
    while (exists) {
      counter++;
      username = `${generated}${counter}`;
      exists = await User.findOne({
        where: { username },
      });
    }
    return username;
  } catch {
    return username;
  }
};

module.exports = generateUsername;
