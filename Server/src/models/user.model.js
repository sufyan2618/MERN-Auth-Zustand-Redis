import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    loginAttempts: {
        type: Number,
        default: 0,
    },
    isBlocked: {
        type: Boolean,
        default: false,
    },
    otp: {
        type: String,
    },
    otpExpiry: {
        type: Date,
    },
    // Email rate limiting
    emailRateLimit: {
        count: {
            type: Number,
            default: 0
        },
        windowStart: {
            type: Date,
            default: null
        },
        resetAfterMinutes: {
            type: Number,
            default: 30 // 30 minutes
        }
    }
}, { timestamps: true });

// Pre-save hooks
userSchema.pre('save', function(next) {
    this.email = this.email.toLowerCase();
    next();
});

userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Password methods
userSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

// Login attempt methods
userSchema.methods.incrementLoginAttempts = function() {
    this.loginAttempts += 1;
};

userSchema.methods.resetLoginAttempts = function() {
    this.loginAttempts = 0;
};

userSchema.methods.blockAccount = function() {
    this.isBlocked = true;
};

// OTP methods
userSchema.methods.generateOTP = function() {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    this.otp = otp;
    this.otpExpiry = Date.now() + 10 * 60 * 1000; // 10 minutes
    return otp;
};

userSchema.methods.clearOTP = function() {
    this.otp = null;
    this.otpExpiry = null;
};

userSchema.methods.verifyOTP = function(candidateOTP) {
    if (!this.otp || !this.otpExpiry) {
        return false;
    }
    const isValid = this.otp === candidateOTP && Date.now() < this.otpExpiry;
    return isValid;
};

// Email rate limiting methods
userSchema.methods.canSendEmail = function() {
    const now = new Date();
    const windowDuration = this.emailRateLimit.resetAfterMinutes * 60 * 1000; // 15 minutes in ms
    
    // If no window exists or window has expired, reset
    if (!this.emailRateLimit.windowStart || 
        (now - this.emailRateLimit.windowStart) > windowDuration) {
        this.emailRateLimit.count = 0;
        this.emailRateLimit.windowStart = now;
    }
    
    // Check if limit exceeded
    const MAX_EMAILS_PER_WINDOW = 5;
    if (this.emailRateLimit.count >= MAX_EMAILS_PER_WINDOW) {
        const timeRemaining = windowDuration - (now - this.emailRateLimit.windowStart);
        return {
            allowed: false,
            remainingTime: Math.ceil(timeRemaining / 1000 / 60), // minutes
            message: `Rate limit exceeded. Please try again in ${Math.ceil(timeRemaining / 1000 / 60)} minutes.`
        };
    }
    
    return { allowed: true };
};

userSchema.methods.incrementEmailCount = function() {
    this.emailRateLimit.count += 1;
};

userSchema.methods.getRemainingEmailAttempts = function() {
    const MAX_EMAILS_PER_WINDOW = 5;
    return Math.max(0, MAX_EMAILS_PER_WINDOW - this.emailRateLimit.count);
};

userSchema.methods.resetEmailRateLimit = function() {
    this.emailRateLimit.count = 0;
    this.emailRateLimit.windowStart = null;
};

const User = mongoose.model("User", userSchema);

export default User;
