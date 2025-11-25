import User from "../models/user.model.js";
import { ENV } from "../util/dotenv.js";
import { otpVerificationTemplate } from "../util/templates/otp-verification.js";
import { passwordChangedTemplate } from "../util/templates/password-changed.js";
import { generateToken } from "../util/generateToken.js";
import { emailQueue } from "../queues/index.js";
import { logger } from "../config/logger.js";

export const register = async (req, res) => {
    logger.info(`Registration attempt: ${req.body.email}`);
    try {
        const { firstName, lastName, email, password } = req.body;
        
        // Check if user already exists
        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            // If user exists but not verified, check rate limit and resend OTP
            if (!existingUser.isVerified) {
                const rateLimitCheck = existingUser.canSendEmail();
                if (!rateLimitCheck.allowed) {
                    return res.status(429).json({ 
                        success: false, 
                        message: rateLimitCheck.message,
                        remainingTime: rateLimitCheck.remainingTime
                    });
                }
                
                // Resend OTP
                const otp = existingUser.generateOTP();
                logger.info(`Resent OTP for ${email}: ${otp}`);
                
                const emailTemplate = otpVerificationTemplate(existingUser.firstName, otp);
                
                try {
                    await emailQueue.add("sendEmail", {
                        to: email,
                        subject: "OTP Verification",
                        html: emailTemplate
                    });
                    existingUser.incrementEmailCount();
                    await existingUser.save();
                    
                    return res.status(200).json({
                        success: true,
                        message: "User already registered but not verified. OTP resent to your email.",
                        remainingAttempts: existingUser.getRemainingEmailAttempts()
                    });
                } catch (error) {
                    logger.error(`Error sending OTP email: ${error.message}`);
                    return res.status(500).json({ 
                        success: false, 
                        message: "Failed to send OTP email" 
                    });
                }
            }
            
            return res.status(400).json({ 
                success: false, 
                message: "User already exists and is verified" 
            });
        }
        
        // Create new user
        const user = new User({ firstName, lastName, email, password });
        
        // Generate and send OTP
        const otp = user.generateOTP();
        logger.info(`OTP for ${email}: ${otp}`);

        const emailTemplate = otpVerificationTemplate(firstName, otp);
        
        try {
            logger.info(`Sending verification email to ${email}`)
            await emailQueue.add("sendEmail", {
                to: email,
                subject: "OTP Verification",
                html: emailTemplate 
            });
            user.incrementEmailCount();
            await user.save();
            
            res.status(201).json({
                success: true,
                data: {
                    user: {
                        _id: user._id,
                        firstName: user.firstName,
                        lastName: user.lastName,
                        email: user.email,
                        isVerified: user.isVerified
                    }
                },
                message: "User registered successfully. Please check your email for OTP verification.",
                remainingAttempts: user.getRemainingEmailAttempts()
            });
        } catch (error) {
            logger.error(`Error sending OTP email: ${error.message}`);
            // Delete user if email fails
            await User.deleteOne({ _id: user._id });
            return res.status(500).json({ 
                success: false, 
                message: "Failed to send verification email" 
            });
        }
    } catch (error) {
        logger.error(`Registration error: ${error.message}`);
        res.status(500).json({ 
            success: false, 
            message: "Server error", 
            error: error.message 
        });
    }
};

export const verifyOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;
        const user = await User.findOne({ email: email.toLowerCase() });
        
        if (!user) {
            return res.status(400).json({ 
                success: false, 
                message: "User not found" 
            });
        }
        
        if (!user.verifyOTP(otp)) {
            return res.status(400).json({ 
                success: false, 
                message: "Invalid or expired OTP" 
            });
        }
        
        user.isVerified = true;
        user.clearOTP();
        user.resetEmailRateLimit(); // Reset rate limit after successful verification
        await user.save();
        
        res.status(200).json({ 
            success: true, 
            message: "User verified successfully" 
        });
    } catch (error) {
        logger.error(`Verify OTP error: ${error.message}`);
        res.status(500).json({ 
            success: false, 
            message: "Server error" 
        });
    }
};



export const login = async (req, res) => {
    logger.info(`Login attempt: ${req.body.email}`);
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email: email.toLowerCase() });
        
        if (!user) {
            return res.status(400).json({ 
                success: false, 
                message: "Invalid credentials" 
            });
        }
        
        if (!user.isVerified) {
            return res.status(400).json({ 
                success: false, 
                message: "Please verify your email first" 
            });
        }
        
        if (user.isBlocked) {
            return res.status(403).json({ 
                success: false, 
                message: "Account is temporarily blocked due to multiple failed login attempts. Please contact support." 
            });
        }
        
        const isPasswordValid = await user.comparePassword(password);
        
        if (!isPasswordValid) {
            user.incrementLoginAttempts();
            
            if (user.loginAttempts >= 5) {
                user.blockAccount();
            }
            
            await user.save();
            
            const attemptsRemaining = Math.max(0, 5 - user.loginAttempts);
            
            return res.status(400).json({ 
                success: false, 
                message: attemptsRemaining > 0 
                    ? `Invalid credentials. ${attemptsRemaining} attempts remaining.`
                    : "Account blocked due to too many failed attempts."
            });
        }
        
        // Successful login - reset counters
        user.resetLoginAttempts();
        user.isBlocked = false;
        await user.save();
        
        const token = generateToken({ id: user._id });
        
        res.cookie("token", token, {
            httpOnly: true,
            secure: ENV.NODE_ENV === 'production',
            sameSite: 'Lax',
            maxAge: 3600000 // 1 hour
        });
        
        res.status(200).json({
            success: true,
            data: {
                user: {
                    _id: user._id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    isVerified: user.isVerified
                }
            },
            accessToken: token,
            message: "Login successful"
        });
    } catch (error) {
        logger.error(`Login error: ${error.message}`);
        res.status(500).json({ 
            success: false, 
            message: "Server error", 
            error: error.message 
        });
    }
};



export const logout = (req, res) => {
    res.clearCookie("token", {
        httpOnly: true,
        secure: ENV.NODE_ENV === 'production',
        sameSite: 'Lax'
    });
    res.status(200).json({ 
        success: true, 
        message: "Logout successful" 
    });
};



export const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id)
            .select("-password -otp -otpExpiry -loginAttempts -isBlocked -emailRateLimit");
        
        if (!user) {
            return res.status(404).json({ 
                success: false, 
                message: "User not found" 
            });
        }
        
        res.status(200).json({ 
            success: true, 
            data: user 
        });
    } catch (error) {
        logger.error(`Get profile error: ${error.message}`);
        res.status(500).json({ 
            success: false, 
            message: "Server error" 
        });
    }
};



export const resendOTP = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email: email.toLowerCase() });
        
        if (!user) {
            return res.status(400).json({ 
                success: false, 
                message: "User not found" 
            });
        }
        
        if (user.isVerified) {
            return res.status(400).json({ 
                success: false, 
                message: "User is already verified" 
            });
        }
        
        // Check rate limit with automatic reset
        const rateLimitCheck = user.canSendEmail();
        if (!rateLimitCheck.allowed) {
            return res.status(429).json({ 
                success: false, 
                message: rateLimitCheck.message,
                remainingTime: rateLimitCheck.remainingTime
            });
        }
        
        // Generate and send OTP
        const otp = user.generateOTP();
        logger.info(`Resent OTP for ${email}: ${otp}`);
        
        const emailTemplate = otpVerificationTemplate(user.firstName, otp);
        
        try {
            await emailQueue.add("sendEmail", {
                to: email,
                subject: "OTP Verification",
                html: emailTemplate 
            });
            
            // Increment counter after successful send
            user.incrementEmailCount();
            await user.save();
            
            const remaining = user.getRemainingEmailAttempts();
            
            res.status(200).json({ 
                success: true, 
                message: "OTP resent successfully",
                remainingAttempts: remaining
            });
        } catch (error) {
            logger.error(`Error sending OTP email: ${error.message}`);
            return res.status(500).json({ 
                success: false, 
                message: "Failed to send OTP email" 
            });
        }
    } catch (error) {
        logger.error(`Resend OTP error: ${error.message}`);
        res.status(500).json({ 
            success: false, 
            message: "Server error" 
        });
    }
};



export const resetPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email: email.toLowerCase() });
        
        if (!user) {
            return res.status(400).json({ 
                success: false, 
                message: "User not found" 
            });
        }
        
        // Check rate limit with automatic reset
        const rateLimitCheck = user.canSendEmail();
        if (!rateLimitCheck.allowed) {
            return res.status(429).json({ 
                success: false, 
                message: rateLimitCheck.message,
                remainingTime: rateLimitCheck.remainingTime
            });
        }
        
        // Generate and send OTP
        const otp = user.generateOTP();
        logger.info(`OTP for password reset ${email}: ${otp}`);
        
        const emailTemplate = otpVerificationTemplate(user.firstName, otp);
        
        try {
            await emailQueue.add("sendEmail", {
                to: email,
                subject: "Password Reset OTP",
                html: emailTemplate
            });
            
            // Increment counter after successful send
            user.incrementEmailCount();
            await user.save();
            
            const remaining = user.getRemainingEmailAttempts();
            
            res.status(200).json({ 
                success: true, 
                message: "Password reset OTP sent successfully",
                remainingAttempts: remaining
            });
        } catch (error) {
            logger.error(`Error sending OTP email: ${error.message}`);
            return res.status(500).json({ 
                success: false, 
                message: "Failed to send OTP email" 
            });
        }
    } catch (error) {
        logger.error(`Reset password error: ${error.message}`);
        res.status(500).json({ 
            success: false, 
            message: "Server error" 
        });
    }
};




export const updatePassword = async (req, res) => {
    try {
        const { email, newPassword, confirmNewPassword } = req.body;
        
        if (newPassword !== confirmNewPassword) {
            return res.status(400).json({ 
                success: false, 
                message: "Passwords do not match" 
            });
        }
        
        if (newPassword.length < 6) {
            return res.status(400).json({ 
                success: false, 
                message: "Password must be at least 6 characters long" 
            });
        }
        
        const user = await User.findOne({ email: email.toLowerCase() });
        
        if (!user) {
            return res.status(400).json({ 
                success: false, 
                message: "User not found" 
            });
        }
        
        
        // Update password
        user.password = newPassword;
        user.clearOTP();
        user.resetEmailRateLimit(); // Reset after successful password change
        await user.save();
        
        // Send confirmation email
        const emailTemplate = passwordChangedTemplate(user.firstName);
        try {
            await emailQueue.add("sendEmail", {
                to: email,
                subject: "Password Changed Successfully",
                html: emailTemplate
            });
        } catch (error) {
            logger.error(`Error sending password changed email: ${error.message}`);
        }
        
        res.status(200).json({ 
            success: true, 
            message: "Password updated successfully" 
        });
    } catch (error) {
        logger.error(`Update password error: ${error.message}`);
        res.status(500).json({ 
            success: false, 
            message: "Server error" 
        });
    }
};
