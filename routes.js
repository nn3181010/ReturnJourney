const express = require('express');
const { validateIPAddress } = require('./ipinfo');
const { sendOTP } = require('./twilio');
const { compareOTP } = require('./bcrypt');
const UserModel = require('./models/user');

const router = express.Router();

// Middleware to validate IP address
router.use(async (req, res, next) => {
  const userIP = req.ip; // Extract the user's IP address from the request object

  // Validate user's IP address
  const ipInfo = await validateIPAddress(userIP);

  if (ipInfo && ipInfo.countryCode === 'US') {
    // You can add more IP validation logic here
    next();
  } else {
    res.status(403).json({ message: 'Access denied from this IP address' });
  }
});

// Generate and send OTP
router.post('/generate-otp', async (req, res) => {
  const { phoneNumber } = req.body;
  const otp = Math.floor(1000 + Math.random() * 9000).toString(); // Generate a 4-digit OTP

  // Store the OTP in the user's document in the database (for later validation)
  const user = await UserModel.findOneAndUpdate(
    { phoneNumber },
    { otp },
    { new: true }
  );

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  // Send OTP via Twilio
  sendOTP(phoneNumber, otp);

  res.json({ message: 'OTP sent successfully' });
});

// Validate OTP and register the user
router.post('/register', async (req, res) => {
  const { phoneNumber, otp, username, password } = req.body;

  // Find the user by phone number and check OTP
  const user = await UserModel.findOne({ phoneNumber });

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  const isOTPValid = await compareOTP(otp, user.otp);

  if (!isOTPValid) {
    return res.status(401).json({ message: 'Invalid OTP' });
  }

  // OTP is valid, register the user
  user.username = username;
  user.password = password; // You should hash the password using bcrypt

  await user.save();

  res.json({ message: 'User registered successfully' });
});

module.exports = router;
