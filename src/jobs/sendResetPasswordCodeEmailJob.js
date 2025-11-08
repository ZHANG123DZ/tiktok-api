const transporter = require('@/configs/mail');

const loadEmail = require('@/utils/loadEmail');

async function sendResetPasswordCodeEmailJob(job) {
  const data = JSON.parse(job.payload);
  const email = data.email;
  const template = await loadEmail('auth/forgot-password', { data });

  try {
    await transporter.sendMail({
      from: 'TikTok <tue08610@gmail.com>',
      subject: 'Change your password',
      to: email,
      html: template,
    });
  } catch (err) {
    console.log(err);
  }
}

module.exports = sendResetPasswordCodeEmailJob;
