require('dotenv').config();
const Pusher = require('pusher');

const pusher = new Pusher({
  appId: 'tiktok',
  key: process.env.SOKETI_KEY,
  secret: process.env.SOKETI_SECRET,
  cluster: '',
  host: process.env.SOKETI_PORT,
  port: 6001,
  useTLS: false,
});

module.exports = pusher;
