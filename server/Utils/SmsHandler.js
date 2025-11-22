// Utils/SmsHandler.js
const otpStore = {};

export const sendAuthCode = async (phoneNumber) => {
  try {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    otpStore[phoneNumber] = code;

    console.log(`🔔 OTP for ${phoneNumber}: ${code}`);

    return { success: true, message: "OTP sent successfully" };
  } catch (err) {
    return { success: false, message: "Failed to send OTP" };
  }
};

export const verifyCode = async (phoneNumber, code) => {
  const validCode = otpStore[phoneNumber];
  if (!validCode) return { success: false, message: "No OTP found" };
  if (validCode !== code) return { success: false, message: "Invalid OTP" };

  
  delete otpStore[phoneNumber];
  return { success: true, message: "OTP verified successfully" };
};
