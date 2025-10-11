const { sendCodeSMS } = require('@/services/phone.service');

async function sendPhoneCodeJob(job) {
  const data = JSON.parse(job.payload);
  const phone = data.phone;
  const code = data.code;
  const message = `[TikTok] ${code} là mã xác minh của bạn`;
  try {
    await sendCodeSMS(phone, message);
  } catch (err) {
    console.log(err);
  }
}

module.exports = sendPhoneCodeJob;
