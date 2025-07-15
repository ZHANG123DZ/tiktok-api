const transporter = require('@/configs/mail');

const loadEmail = require('@/utils/loadEmail');

async function scheduledAnnouncementEmail(job) {
  const data = JSON.parse(job.payload);
  const email = 'hoangtrung123nek@gmail.com';
  const template = await loadEmail('auth/scheduledAnnouncementEmail', { data });

  const info = await transporter.sendMail({
    from: 'TikTok <khanh123tran999@gmail.com>',
    subject: 'Thông báo cập nhật mật khẩu khẩn cấp',
    to: email,
    html: template,
  });
}

module.exports = scheduledAnnouncementEmail;
