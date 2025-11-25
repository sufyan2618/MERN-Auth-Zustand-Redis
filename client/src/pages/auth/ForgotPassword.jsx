import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useAuthStore from '../../store/useAuthStore';
import useToast from '../../hooks/useToast';
import {
    Mail,
    KeyRound,
    CheckCircle2,
    XCircle,
    Loader2,
    ArrowRight,
    ArrowLeft,
    Shield,
    Clock,
    Info
} from 'lucide-react';

const ForgotPassword = () => {
    const navigate = useNavigate();
    const toast = useToast();
    const { ResetPassword: resetPassword, isResettingPassword } = useAuthStore();
    const [email, setEmail] = useState('');
    const [error, setError] = useState(null);
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setMessage('');

        try {
            const response = await resetPassword({ email });
            toast.success('Reset OTP sent to your email! Check your inbox.');
            setMessage(response.message);
            setTimeout(() => {
                navigate('/verify-reset-otp', { state: { email } });
            }, 1500);
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Failed to send reset OTP. Please try again.';
            toast.error(errorMessage);
            setError(errorMessage);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-gray-100 px-4 py-8 sm:px-6 lg:px-8">
            <div className="w-full max-w-md">
                <div className="bg-white rounded-3xl shadow-2xl p-8 sm:p-12">
                    {/* Icon */}
                    <div className="flex justify-center mb-8">
                        <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-700 rounded-2xl flex items-center justify-center shadow-lg">
                            <KeyRound className="w-10 h-10 text-white" />
                        </div>
                    </div>

                    {/* Header */}
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold text-gray-900 mb-3">Forgot Password?</h2>
                        <p className="text-gray-500 text-sm leading-relaxed">
                            No worries! Enter your email address and we'll send you a verification code to reset your password.
                        </p>
                    </div>

                    {/* Messages */}
                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start space-x-3">
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
                            <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                                Email Address
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    placeholder="john.doe@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 hover:border-gray-300"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isResettingPassword}
                            className="w-full py-4 px-6 bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-indigo-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                        >
                            {isResettingPassword ? (
                                <span className="flex items-center justify-center">
                                    <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                                    Sending code...
                                </span>
                            ) : (
                                <span className="flex items-center justify-center">
                                    Send Reset Code
                                    <ArrowRight className="w-5 h-5 ml-2" />
                                </span>
                            )}
                        </button>
                    </form>

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

                {/* Info Cards */}
                <div className="mt-6 space-y-4">
                    <div className="bg-blue-50 rounded-2xl p-4 border border-blue-100">
                        <div className="flex items-start space-x-3">
                            <Shield className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                            <div>
                                <p className="text-sm font-semibold text-blue-900 mb-1">Secure Process</p>
                                <p className="text-xs text-blue-700">Your password reset request is encrypted and secure.</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-amber-50 rounded-2xl p-4 border border-amber-100">
                        <div className="flex items-start space-x-3">
                            <Clock className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                            <div>
                                <p className="text-sm font-semibold text-amber-900 mb-1">Quick Delivery</p>
                                <p className="text-xs text-amber-700">Check your email. The code should arrive within 2 minutes.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
