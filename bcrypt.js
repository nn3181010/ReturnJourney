const bcrypt = require('bcrypt');

// Hash a plain text OTP and compare it with the stored hash
async function compareOTP(plainOTP, hashedOTP) {
  try {
    const match = await bcrypt.compare(plainOTP, hashedOTP);
    return match;
  } catch (error) {
    console.error('Error comparing OTP:', error);
    return false;
  }
}

module.exports = { compareOTP };
