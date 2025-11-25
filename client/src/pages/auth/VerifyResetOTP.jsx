import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import useAuthStore from '../../store/useAuthStore';
import useToast from '../../hooks/useToast';
import {
    ShieldCheck,
    CheckCircle2,
    XCircle,
    Loader2,
    RefreshCw,
    ArrowLeft,
    ArrowRight,
    AlertTriangle
} from 'lucide-react';

const VerifyResetOTP = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const toast = useToast();
    const { VerifyOTP: verifyOTP, ResetPassword: resetPassword, isVerifyingOTP, isResettingPassword } = useAuthStore();
    const email = location.state?.email;
    
    const [otp, setOtp] = useState('');
    const [error, setError] = useState(null);
    const [message, setMessage] = useState('');
    const [countdown, setCountdown] = useState(60);
    const [canResend, setCanResend] = useState(false);
    const inputRef = useRef(null);

    useEffect(() => {
        if (!email) {
            navigate('/forgot-password');
        }
    }, [email, navigate]);

    useEffect(() => {
        // Auto-focus input on mount
        if (inputRef.current) {
            inputRef.current.focus();
        }

        // Countdown timer for resend
        if (countdown > 0 && !canResend) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
            return () => clearTimeout(timer);
        } else if (countdown === 0) {
            setCanResend(true);
        }
    }, [countdown, canResend]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setMessage('');

        try {
            const response = await verifyOTP({ email, otp });
            setMessage(response.message);
            toast.success(response.message);
            setTimeout(() => {
                navigate('/reset-password', { state: { email, otp } });
            }, 1000);
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid or expired OTP. Please try again.');
            toast.error(err.response?.data?.message || 'Invalid or expired OTP. Please try again.');
        }
    };

    const handleResendOTP = async () => {
        setError(null);
        setMessage('');

        try {
            const response = await resetPassword({ email });
            setMessage(response.message);
            setCountdown(60);
            setCanResend(false);
            setOtp('');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to resend OTP. Please try again.');
        }
    };

    const handleOtpChange = (e) => {
        const value = e.target.value.replace(/\D/g, '').slice(0, 6);
        setOtp(value);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-gray-100 px-4 py-8 sm:px-6 lg:px-8">
            <div className="w-full max-w-md">
                <div className="bg-white rounded-3xl shadow-2xl p-8 sm:p-12">
                    {/* Icon */}
                    <div className="flex justify-center mb-8">
                        <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-700 rounded-2xl flex items-center justify-center shadow-lg">
                            <ShieldCheck className="w-10 h-10 text-white" />
                        </div>
                    </div>

                    {/* Header */}
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold text-gray-900 mb-3">Verify Reset Code</h2>
                        <p className="text-gray-500 text-sm leading-relaxed">
                            We've sent a 6-digit verification code to
                        </p>
                        <p className="text-indigo-600 font-semibold mt-1">{email}</p>
                        <p className="text-gray-400 text-xs mt-2">Enter the code to reset your password</p>
                    </div>

                    {/* Messages */}
                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start space-x-3 animate-shake">
                            <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                            <p className="text-red-800 text-sm font-medium">{error}</p>
                        </div>
                    )}

                    {message && (
                        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-start space-x-3">
                            <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                            <p className="text-green-800 text-sm font-medium">{message}</p>
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="otp" className="block text-sm font-semibold text-gray-700 mb-3 text-center">
                                Enter Verification Code
                            </label>
                            <input
                                ref={inputRef}
                                type="text"
                                id="otp"
                                name="otp"
                                placeholder="000000"
                                value={otp}
                                onChange={handleOtpChange}
                                maxLength={6}
                                inputMode="numeric"
                                autoComplete="one-time-code"
                                pattern="\d{6}"
                                required
                                className="w-full px-6 py-4 text-center text-2xl font-bold tracking-widest bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 hover:border-gray-300"
                            />
                            <div className="mt-2 flex items-center justify-center">
                                <div className="flex space-x-1">
                                    {[...Array(6)].map((_, index) => (
                                        <div
                                            key={index}
                                            className={`w-2 h-2 rounded-full transition-all duration-200 ${
                                                index < otp.length ? 'bg-indigo-600' : 'bg-gray-300'
                                            }`}
                                        ></div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isVerifyingOTP || otp.length !== 6}
                            className="w-full py-4 px-6 bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-indigo-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                        >
                            {isVerifyingOTP ? (
                                <span className="flex items-center justify-center">
                                    <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                                    Processing...
                                </span>
                            ) : (
                                <span className="flex items-center justify-center">
                                    Continue to Reset Password
                                    <ArrowRight className="w-5 h-5 ml-2" />
                                </span>
                            )}
                        </button>
                    </form>

                    {/* Resend Section */}
                    <div className="mt-8 text-center">
                        {!canResend ? (
                            <p className="text-sm text-gray-500">
                                Didn't receive the code? Resend in{' '}
                                <span className="font-semibold text-indigo-600">{countdown}s</span>
                            </p>
                        ) : (
                            <button
                                onClick={handleResendOTP}
                                disabled={isResettingPassword}
                                className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center"
                            >
                                {isResettingPassword ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        Resending...
                                    </>
                                ) : (
                                    <>
                                        <RefreshCw className="w-4 h-4 mr-1" />
                                        Resend Code
                                    </>
                                )}
                            </button>
                        )}
                    </div>

                    {/* Back to Login */}
                    <div className="mt-8 pt-6 border-t border-gray-200">
                        <Link
                            to="/login"
                            className="flex items-center justify-center text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors duration-200"
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to Login
                        </Link>
                    </div>
                </div>

                {/* Security Info Box */}
                <div className="mt-6 bg-amber-50 rounded-2xl p-4 border border-amber-100">
                    <div className="flex items-start space-x-3">
                        <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                        <div>
                            <p className="text-sm font-semibold text-amber-900 mb-1">Security Notice</p>
                            <p className="text-xs text-amber-700">This code expires in 10 minutes. Don't share it with anyone.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VerifyResetOTP;
