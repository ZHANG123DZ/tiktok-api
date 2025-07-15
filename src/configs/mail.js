const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "khanh123tran999@gmail.com",
    pass: process.env.GOOGLE_APP_PASSWORD,
  },
});

module.exports = transporter;
