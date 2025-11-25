import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import useAuthStore from '../../store/useAuthStore';
import useToast from '../../hooks/useToast';
import {
    Lock,
    CheckCircle2,
    XCircle,
    Loader2,
    ArrowLeft,
    Eye,
    EyeOff,
    ShieldCheck,
    Info,
    Check
} from 'lucide-react';

const ResetPassword = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const toast = useToast();
    const { UpdatePassword: updatePassword, isUpdatingPassword } = useAuthStore();
    const email = location.state?.email;
    const otp = location.state?.otp;
    
    const [formData, setFormData] = useState({
        newPassword: '',
        confirmNewPassword: '',
    });
    const [error, setError] = useState(null);
    const [message, setMessage] = useState('');
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState('');
    const [passwordMatch, setPasswordMatch] = useState(null);

    useEffect(() => {
        if (!email || !otp) {
            navigate('/forgot-password');
        }
    }, [email, otp, navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });

        // Password strength indicator
        if (name === 'newPassword') {
            if (value.length === 0) {
                setPasswordStrength('');
            } else if (value.length < 6) {
                setPasswordStrength('weak');
            } else if (value.length < 10) {
                setPasswordStrength('medium');
            } else {
                setPasswordStrength('strong');
            }
        }

        // Check password match
        if (name === 'confirmNewPassword') {
            if (value.length > 0) {
                setPasswordMatch(value === formData.newPassword);
            } else {
                setPasswordMatch(null);
            }
        }

        if (name === 'newPassword' && formData.confirmNewPassword.length > 0) {
            setPasswordMatch(value === formData.confirmNewPassword);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setMessage('');

        if (formData.newPassword !== formData.confirmNewPassword) {
            setError('Passwords do not match');
            return;
        }

        if (formData.newPassword.length < 6) {
            setError('Password must be at least 6 characters long');
            return;
        }

        try {
            const response = await updatePassword({
                email,
                otp,
                newPassword: formData.newPassword,
                confirmNewPassword: formData.confirmNewPassword,
            });
            toast.success('Password reset successful! Please login with your new password.');
            setMessage(response.message);
            setTimeout(() => {
                navigate('/login');
            }, 2000);
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Failed to reset password. Please try again.';
            toast.error(errorMessage);
            setError(errorMessage);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-gray-50 via-white to-gray-100 px-4 py-8 sm:px-6 lg:px-8">
            <div className="w-full max-w-md">
                <div className="bg-white rounded-3xl shadow-2xl p-8 sm:p-12">
                    {/* Icon */}
                    <div className="flex justify-center mb-8">
                        <div className="w-20 h-20 bg-linear-to-br from-blue-600 to-purple-700 rounded-2xl flex items-center justify-center shadow-lg">
                            <ShieldCheck className="w-10 h-10 text-white" />
                        </div>
                    </div>

                    {/* Header */}
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold text-gray-900 mb-3">Reset Password</h2>
                        <p className="text-gray-500 text-sm leading-relaxed">
                            Create a strong new password for your account
                        </p>
                    </div>

                    {/* Messages */}
                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start space-x-3">
                            <XCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                            <p className="text-red-800 text-sm font-medium">{error}</p>
                        </div>
                    )}

                    {message && (
                        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-start space-x-3">
                            <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                            <p className="text-green-800 text-sm font-medium">{message}</p>
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label htmlFor="newPassword" className="block text-sm font-semibold text-gray-700 mb-2">
                                New Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type={showNewPassword ? "text" : "password"}
                                    id="newPassword"
                                    name="newPassword"
                                    placeholder="Create a strong password"
                                    value={formData.newPassword}
                                    onChange={handleChange}
                                    required
                                    className="w-full pl-12 pr-12 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 hover:border-gray-300"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowNewPassword(!showNewPassword)}
                                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                                >
                                    {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>

                            {/* Password Strength Indicator */}
                            {passwordStrength && (
                                <div className="mt-2">
                                    <div className="flex items-center space-x-2">
                                        <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                            <div 
                                                className={`h-full transition-all duration-300 ${
                                                    passwordStrength === 'weak' ? 'w-1/3 bg-red-500' :
                                                    passwordStrength === 'medium' ? 'w-2/3 bg-yellow-500' :
                                                    'w-full bg-green-500'
                                                }`}
                                            ></div>
                                        </div>
                                        <span className={`text-xs font-medium ${
                                            passwordStrength === 'weak' ? 'text-red-600' :
                                            passwordStrength === 'medium' ? 'text-yellow-600' :
                                            'text-green-600'
                                        }`}>
                                            {passwordStrength.charAt(0).toUpperCase() + passwordStrength.slice(1)}
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div>
                            <label htmlFor="confirmNewPassword" className="block text-sm font-semibold text-gray-700 mb-2">
                                Confirm New Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    id="confirmNewPassword"
                                    name="confirmNewPassword"
                                    placeholder="Confirm your password"
                                    value={formData.confirmNewPassword}
                                    onChange={handleChange}
                                    required
                                    className={`w-full pl-12 pr-12 py-3.5 bg-gray-50 border rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 hover:border-gray-300 ${
                                        passwordMatch === false ? 'border-red-300 bg-red-50' : 
                                        passwordMatch === true ? 'border-green-300 bg-green-50' : 'border-gray-200'
                                    }`}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                                >
                                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>

                            {/* Password Match Indicator */}
                            {passwordMatch !== null && (
                                <div className="mt-2">
                                    {passwordMatch ? (
                                        <div className="flex items-center text-green-600 text-xs">
                                            <Check className="w-4 h-4 mr-1" />
                                            <span>Passwords match</span>
                                        </div>
                                    ) : (
                                        <div className="flex items-center text-red-600 text-xs">
                                            <XCircle className="w-4 h-4 mr-1" />
                                            <span>Passwords do not match</span>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Password Requirements */}
                        <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                            <p className="text-xs font-semibold text-gray-700 mb-2">Password must contain:</p>
                            <div className="space-y-1.5">
                                <div className={`flex items-center text-xs ${formData.newPassword.length >= 6 ? 'text-green-600' : 'text-gray-500'}`}>
                                    <div className={`w-4 h-4 rounded-full mr-2 flex items-center justify-center ${formData.newPassword.length >= 6 ? 'bg-green-100' : 'bg-gray-200'}`}>
                                        {formData.newPassword.length >= 6 && <Check className="w-3 h-3" />}
                                    </div>
                                    At least 6 characters
                                </div>
                                <div className={`flex items-center text-xs ${/[A-Z]/.test(formData.newPassword) ? 'text-green-600' : 'text-gray-500'}`}>
                                    <div className={`w-4 h-4 rounded-full mr-2 flex items-center justify-center ${/[A-Z]/.test(formData.newPassword) ? 'bg-green-100' : 'bg-gray-200'}`}>
                                        {/[A-Z]/.test(formData.newPassword) && <Check className="w-3 h-3" />}
                                    </div>
                                    One uppercase letter
                                </div>
                                <div className={`flex items-center text-xs ${/[a-z]/.test(formData.newPassword) ? 'text-green-600' : 'text-gray-500'}`}>
                                    <div className={`w-4 h-4 rounded-full mr-2 flex items-center justify-center ${/[a-z]/.test(formData.newPassword) ? 'bg-green-100' : 'bg-gray-200'}`}>
                                        {/[a-z]/.test(formData.newPassword) && <Check className="w-3 h-3" />}
                                    </div>
                                    One lowercase letter
                                </div>
                                <div className={`flex items-center text-xs ${/[0-9]/.test(formData.newPassword) ? 'text-green-600' : 'text-gray-500'}`}>
                                    <div className={`w-4 h-4 rounded-full mr-2 flex items-center justify-center ${/[0-9]/.test(formData.newPassword) ? 'bg-green-100' : 'bg-gray-200'}`}>
                                        {/[0-9]/.test(formData.newPassword) && <Check className="w-3 h-3" />}
                                    </div>
                                    One number
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isUpdatingPassword || !passwordMatch}
                            className="w-full py-4 px-6 bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-indigo-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                        >
                            {isUpdatingPassword ? (
                                <span className="flex items-center justify-center">
                                    <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                                    Resetting password...
                                </span>
                            ) : (
                                <span className="flex items-center justify-center">
                                    Reset Password
                                    <CheckCircle2 className="w-5 h-5 ml-2" />
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

                {/* Security Info */}
                <div className="mt-6 bg-blue-50 rounded-2xl p-4 border border-blue-100">
                    <div className="flex items-start space-x-3">
                        <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                        <div>
                            <p className="text-sm font-semibold text-blue-900 mb-1">Security Tip</p>
                            <p className="text-xs text-blue-700">Use a unique password that you don't use anywhere else to keep your account secure.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;
