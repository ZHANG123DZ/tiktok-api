const transporter = require('@/configs/mail');
const usersService = require('@/services/users.service');

const loadEmail = require('@/utils/loadEmail');

async function sendVerifyEmailJob(job) {
  const data = JSON.parse(job.payload);

  const user = await usersService.getById(data.id);
  const template = await loadEmail('auth/verification', { data });
  const info = await transporter.sendMail({
    from: 'Công ty TikTok Việt Nam',
    subject: 'Xác thực Email',
    to: user.email,
    html: template,
  });
  await usersService.update(userId, {
    email_sent_at: new Date(),
  });
}

module.exports = sendVerifyEmailJob;
