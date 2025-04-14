// // utils/sendOtpEmail.js
// const { Resend } = require('resend');
// require('dotenv').config();

// const resend = new Resend(process.env.RESEND_API_KEY);

// const sendOtpEmail = async (email, otp) => {
//   try {
//     const response = await resend.emails.send({
//       from: 'Your App <your_verified_email@gmail.com>',
//       to: email,
//       subject: 'Your OTP Code',
//       html: `<p>Your OTP is <strong>${otp}</strong>. It expires in 5 minutes.</p>`
//     });

//     return response;
//   } catch (err) {
//     console.error("Error sending OTP email:", err);
//     throw err;
//   }
// };

// module.exports = sendOtpEmail;
