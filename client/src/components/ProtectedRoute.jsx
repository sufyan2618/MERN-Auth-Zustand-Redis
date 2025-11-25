import { Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import useAuthStore from '../store/useAuthStore';

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, token, isCheckingAuth, CheckAuth } = useAuthStore();

    useEffect(() => {
        if (token && !isAuthenticated && !isCheckingAuth) {
            CheckAuth();
        }
    }, [token, isAuthenticated, isCheckingAuth, CheckAuth]);

    console.log("isAuthenticated", isAuthenticated, "token", token, "isCheckingAuth", isCheckingAuth);

    if (isCheckingAuth) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    if (!isAuthenticated && !token) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default ProtectedRoute;
