const transporter = require('@/configs/mail');
const userService = require('@/services/user.service');
const emailToken = require('@/utils/emailToken');
const { User } = require('@/models/index');

const loadEmail = require('@/utils/loadEmail');

async function sendVerifyEmailJob(job) {
  const data = JSON.parse(job.payload);
  try {
    const user = await User.findOne({
      where: {
        id: data.userId,
        verified_at: null,
      },
    });
    const tokenVerify = emailToken.create({ sub: user.id });
    const VERIFY_URL = `http://localhost:5173/verify-email?token=${tokenVerify}`;

    const emailData = {
      verifyUrl: VERIFY_URL,
      ...user.dataValues,
    };
    const template = await loadEmail('auth/verification', { data: emailData });
    const info = await transporter.sendMail({
      from: 'Công ty Blog Việt Nam',
      subject: 'Xác thực Email',
      to: user.email,
      html: template,
    });

    await userService.update(data.userId, {
      email_sent_at: new Date(),
    });
  } catch (error) {
    console.log(error);
  }
}

module.exports = sendVerifyEmailJob;
