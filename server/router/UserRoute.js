const express = require('express');
const userRoute = express.Router();
const { Login, requestOtp, verifyOtp, requestOtpLogin, verifyOtpLogin } = require('../Controller/UserControl');

// userRoute.post('/register', Register); // fallback route (not used in OTP flow)
userRoute.post('/login', Login);

// ✅ New routes for OTP flow
userRoute.post('/request-otp-login', requestOtpLogin);
userRoute.post('/verify-otp-login', verifyOtpLogin);
userRoute.post('/request-otp', requestOtp);
userRoute.post('/verify-otp', verifyOtp);

module.exports = userRoute;
