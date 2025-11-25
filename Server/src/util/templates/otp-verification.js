export const otpVerificationTemplate = (firstName, otp) => {
    return `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <h2 style="color: #4CAF50;">OTP Verification</h2>
        <p>Dear ${firstName},</p>
        <p>Your One-Time Password (OTP) for verification is:</p>
        <h3 style="color: #FF5722;">${otp}</h3>
        <p>Please use this OTP to complete your verification process. This OTP is valid for 10 minutes.</p>
        <p>If you did not request this, please ignore this email.</p>
    </div>
    `;
};