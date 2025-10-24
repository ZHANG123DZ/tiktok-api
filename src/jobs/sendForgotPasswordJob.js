const transporter = require('@/configs/mail');

const loadEmail = require('@/utils/loadEmail');

async function sendForgotPasswordJob(job) {
  const data = JSON.parse(job.payload);
  try {
    const reset_url = `https://tiktokk.website:5173/reset-password?token=${data.token}`;

    const emailData = {
      email: data.email,
      reset_url: reset_url,
    };
    const template = await loadEmail('auth/forgot-password', {
      data: emailData,
    });
    const info = await transporter.sendMail({
      from: 'Công ty Blog Việt Nam',
      subject: 'Quên mật khẩu tài khoản',
      to: data.email,
      html: template,
    });
  } catch (error) {
    console.log(error);
  }
}

module.exports = sendForgotPasswordJob;
