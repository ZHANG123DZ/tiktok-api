require("dotenv").config();
const Pusher = require("pusher");

const pusher = new Pusher({
  appId: "app1",
  key: process.env.SOKETI_KEY,
  secret: process.env.SOKETI_SECRET,
  cluster: "",
  host: "103.20.96.194",
  port: 6001,
  useTLS: false,
});

module.exports = pusher;
