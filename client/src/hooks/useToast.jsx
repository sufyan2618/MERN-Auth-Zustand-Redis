import toast from 'react-hot-toast';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';

const useToast = () => {
    const showToast = {
        success: (message, options = {}) => {
            toast.custom((t) => (
                <div
                    className={`${
                        t.visible ? 'animate-enter' : 'animate-leave'
                    } max-w-md w-full bg-white shadow-2xl rounded-2xl pointer-events-auto flex items-start p-4 border border-green-100`}
                >
                    <div className="shrink-0">
                        <div className="w-10 h-10 bg-linear-to-br from-green-400 to-emerald-600 rounded-xl flex items-center justify-center">
                            <CheckCircle className="w-6 h-6 text-white" />
                        </div>
                    </div>
                    <div className="ml-4 flex-1">
                        <p className="text-sm font-semibold text-gray-900">Success</p>
                        <p className="mt-1 text-sm text-gray-600">{message}</p>
                    </div>
                    <button
                        onClick={() => toast.dismiss(t.id)}
                        className="shrink-0 ml-4 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>
            ), {
                duration: 4000,
                position: 'top-right',
                ...options,
            });
        },

        error: (message, options = {}) => {
            toast.custom((t) => (
                <div
                    className={`${
                        t.visible ? 'animate-enter' : 'animate-leave'
                    } max-w-md w-full bg-white shadow-2xl rounded-2xl pointer-events-auto flex items-start p-4 border border-red-100`}
                >
                    <div className="shrink-0">
                        <div className="w-10 h-10 bg-linear-to-br from-red-400 to-rose-600 rounded-xl flex items-center justify-center">
                            <XCircle className="w-6 h-6 text-white" />
                        </div>
                    </div>
                    <div className="ml-4 flex-1">
                        <p className="text-sm font-semibold text-gray-900">Error</p>
                        <p className="mt-1 text-sm text-gray-600">{message}</p>
                    </div>
                    <button
                        onClick={() => toast.dismiss(t.id)}
                        className="shrink-0 ml-4 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>
            ), {
                duration: 5000,
                position: 'top-right',
                ...options,
            });
        },

        warning: (message, options = {}) => {
            toast.custom((t) => (
                <div
                    className={`${
                        t.visible ? 'animate-enter' : 'animate-leave'
                    } max-w-md w-full bg-white shadow-2xl rounded-2xl pointer-events-auto flex items-start p-4 border border-amber-100`}
                >
                    <div className="shrink-0">
                        <div className="w-10 h-10 bg-linear-to-br from-amber-400 to-orange-600 rounded-xl flex items-center justify-center">
                            <AlertCircle className="w-6 h-6 text-white" />
                        </div>
                    </div>
                    <div className="ml-4 flex-1">
                        <p className="text-sm font-semibold text-gray-900">Warning</p>
                        <p className="mt-1 text-sm text-gray-600">{message}</p>
                    </div>
                    <button
                        onClick={() => toast.dismiss(t.id)}
                        className="shrink-0 ml-4 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>
            ), {
                duration: 4000,
                position: 'top-right',
                ...options,
            });
        },

        info: (message, options = {}) => {
            toast.custom((t) => (
                <div
                    className={`${
                        t.visible ? 'animate-enter' : 'animate-leave'
                    } max-w-md w-full bg-white shadow-2xl rounded-2xl pointer-events-auto flex items-start p-4 border border-blue-100`}
                >
                    <div className="shrink-0">
                        <div className="w-10 h-10 bg-linear-to-br from-blue-400 to-indigo-600 rounded-xl flex items-center justify-center">
                            <Info className="w-6 h-6 text-white" />
                        </div>
                    </div>
                    <div className="ml-4 flex-1">
                        <p className="text-sm font-semibold text-gray-900">Info</p>
                        <p className="mt-1 text-sm text-gray-600">{message}</p>
                    </div>
                    <button
                        onClick={() => toast.dismiss(t.id)}
                        className="shrink-0 ml-4 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>
            ), {
                duration: 4000,
                position: 'top-right',
                ...options,
            });
        },

        promise: (promise, messages) => {
            return toast.promise(
                promise,
                {
                    loading: (
                        <div className="flex items-center space-x-3">
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-indigo-600"></div>
                            <span className="text-sm font-medium">{messages.loading}</span>
                        </div>
                    ),
                    success: (
                        <div className="flex items-center space-x-3">
                            <CheckCircle className="w-5 h-5 text-green-600" />
                            <span className="text-sm font-medium">{messages.success}</span>
                        </div>
                    ),
                    error: (
                        <div className="flex items-center space-x-3">
                            <XCircle className="w-5 h-5 text-red-600" />
                            <span className="text-sm font-medium">{messages.error}</span>
                        </div>
                    ),
                },
                {
                    style: {
                        borderRadius: '1rem',
                        background: '#fff',
                        color: '#1f2937',
                        padding: '1rem',
                        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                    },
                }
            );
        },
    };

    return showToast;
};

export default useToast;
