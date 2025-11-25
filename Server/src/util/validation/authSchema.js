import Joi from 'joi';

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;

export const registerSchema = Joi.object({
    firstName: Joi.string().min(2).max(30).trim().required(),
    lastName: Joi.string().min(2).max(30).trim().required(),
    email: Joi.string().email().required().pattern(emailRegex),
    password: Joi.string().min(6).required().pattern(passwordRegex)
        .messages({
            'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
        }),
});

export const loginSchema = Joi.object({
    email: Joi.string().email().required().pattern(emailRegex),
    password: Joi.string().min(6).required().pattern(passwordRegex)
        .messages({
            'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
        }),
});

export const verifyOtpSchema = Joi.object({
    email: Joi.string().email().required().pattern(emailRegex),
    otp: Joi.string().length(6).required()
});