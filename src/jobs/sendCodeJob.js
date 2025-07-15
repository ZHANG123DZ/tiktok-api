const transporter = require("@/configs/mail");

const loadEmail = require("@/utils/loadEmail");

async function sendCodeJob(job) {
  const data = JSON.parse(job.payload);
  const email = data.email;
  const template = await loadEmail("auth/send-code", { data });

  const info = await transporter.sendMail({
    from: "Blog <khanh123tran999@gmail.com>",
    subject: "Xác thực Email",
    to: email,
    html: template,
  });
}

module.exports = sendCodeJob;
