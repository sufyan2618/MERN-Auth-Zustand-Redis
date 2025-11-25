import express from 'express';
import { register, verifyOTP, login, logout, resendOTP, getProfile, resetPassword, updatePassword } from '../controllers/authController.js';
import { authMiddleware } from '../middlewares/auth.js';
import { validate } from '../middlewares/validate.js';
import { registerSchema, loginSchema, verifyOtpSchema } from '../util/validation/authSchema.js';

const router = express.Router();
    
router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);
router.post('/verify-otp', validate(verifyOtpSchema), verifyOTP);
router.post('/resend-otp', resendOTP);
router.post('/reset-password', resetPassword);
router.post('/update-password', updatePassword);


router.post('/logout', authMiddleware, logout);
router.get('/profile', authMiddleware, getProfile);

export default router;


