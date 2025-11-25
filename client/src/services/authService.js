import axiosInstance from "../lib/config/axios";

const services = async (endpoint, method = 'GET', data = null) => {
    try {
        const config = {
            method,
            url: endpoint,
        };
        if (data) {
            config.data = data;
        }
        const response = await axiosInstance(config);
        return response.data;
    } catch (error) {
        throw error;
    }
};

const authService = {
    register: async (userData) => {
        return services('/auth/register', 'POST', userData);
    },
    login: async (credentials) => {
        return services('/auth/login', 'POST', credentials);
    },
    verifyOTP: async (otpData) => {
        return services('/auth/verify-otp', 'POST', otpData);
    },
    resendOTP: async (emailData) => {
        return services('/auth/resend-otp', 'POST', emailData);
    },
    resetPassword: async (emailData) => {
        return services('/auth/reset-password', 'POST', emailData);
    },
    updatePassword: async (passwordData) => {
        return services('/auth/update-password', 'POST', passwordData);
    },
    logout: async () => {
        return services('/auth/logout', 'POST');
    },
    getProfile: async () => {
        return services('/auth/profile', 'GET');
    },
};

export default authService;