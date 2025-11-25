export const passwordChangedTemplate = (name) => {
    return `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <h2 style="color: #4CAF50;">Password Changed Successfully</h2>
            <p>Dear ${name},</p>
            <p>This is to inform you that your account password has been changed successfully.</p>
            <p>If you did not initiate this change, please contact our support team immediately.</p>
            <p>Thank you for using our services!</p>
        </div>
    `;
}