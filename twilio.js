const twilio = require('twilio');

const accountSid = 'YOUR_TWILIO_ACCOUNT_SID';
const authToken = 'YOUR_TWILIO_AUTH_TOKEN';
const client = new twilio(accountSid, authToken);

// Send OTP to user's phone number
async function sendOTP(phoneNumber, otp) {
  try {
    const message = await client.messages.create({
      body: `Your OTP is: ${otp}`,
      from: 'YOUR_TWILIO_PHONE_NUMBER',
      to: phoneNumber,
    });

    console.log('OTP sent successfully:', message.sid);
  } catch (error) {
    console.error('Error sending OTP:', error);
  }
}

module.exports = { sendOTP };
