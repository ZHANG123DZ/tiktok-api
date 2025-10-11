require('dotenv').config();
const twilio = require('twilio');

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

async function sendCodeSMS(toPhone, message) {
  try {
    const msg = await client.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: toPhone,
    });
    console.log('SMS sent, SID:', msg.sid);
    return msg;
  } catch (error) {
    console.error('Error sending SMS:', error);
    throw error;
  }
}

module.exports = {
  sendCodeSMS,
};
