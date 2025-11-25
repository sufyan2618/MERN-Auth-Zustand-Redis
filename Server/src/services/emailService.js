import SibApiV3Sdk from '@sendinblue/client';
import { ENV } from '../util/dotenv.js';

const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
apiInstance.setApiKey(SibApiV3Sdk.TransactionalEmailsApiApiKeys.apiKey, ENV.BREVO_API_KEY);

export const sendEmail = async (to, subject, html) => {
    try {
        const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
        
        sendSmtpEmail.sender = { 
            name: "no-reply", 
            email: ENV.EMAIL_FROM 
        };
        sendSmtpEmail.to = [{ email: to }];
        sendSmtpEmail.subject = subject;
        sendSmtpEmail.htmlContent = html;

        const result = await apiInstance.sendTransacEmail(sendSmtpEmail);
        console.log('Email sent successfully via Brevo API');
        return result;
    } catch (error) {
        console.error('Error sending email via Brevo API:', error.response?.body || error.message || error);
        throw error;
    }
};