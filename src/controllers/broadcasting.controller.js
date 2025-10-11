const pusher = require('@/configs/pusher');
const response = require('@/utils/response');

const index = async (req, res) => {
  const socketId = req.body.socket_id;
  const channel = req.body.channel_name;
  const user = req.user;

  if (!user) {
    response.error(res, 403, 'Chưa xác thực');
  }

  if (channel.startsWith('presence-')) {
    const auth = pusher.authorizeChannel(socketId, channel, {
      userId: user.id,
      userInfo: {
        username: user.username,
        name: user.name,
        avatar: user.avatar,
        lastSeen: user.lastSeen,
        status: 'online',
      },
    });
    return response.success(res, 200, auth);
  }
  response.error(res, 403, 'Chưa xác thực');
};

module.exports = {
  index,
};
