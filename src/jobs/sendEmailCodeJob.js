const transporter = require('@/configs/mail');

const loadEmail = require('@/utils/loadEmail');

async function sendEmailCodeJob(job) {
  const data = JSON.parse(job.payload);
  const email = data.email;
  const template = await loadEmail('auth/send-code', { data });

  try {
    await transporter.sendMail({
      from: 'TikTok <tue08610@gmail.com>',
      subject: 'Xác thực Email',
      to: email,
      html: template,
    });
  } catch (err) {
    console.log(err);
  }
}

module.exports = sendEmailCodeJob;
