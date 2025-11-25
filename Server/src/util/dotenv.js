import dotenv from 'dotenv';
dotenv.config();

export const ENV = {
    MONGO_URI: process.env.MONGO_URI,
    JWT_SECRET: process.env.JWT_SECRET,
    EMAIL_USER: process.env.EMAIL_USER,
    EMAIL_FROM: process.env.EMAIL_FROM || process.env.EMAIL_USER,
    PORT: process.env.PORT || 5000,
    CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:5173',
    NODE_ENV: process.env.NODE_ENV || 'development',
    BREVO_API_KEY: process.env.BREVO_API_KEY,
    REDIS_URL: process.env.REDIS_URL || 'redis://localhost:6379'
}