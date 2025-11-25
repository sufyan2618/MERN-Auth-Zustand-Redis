import { useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/useAuthStore';
import { useEffect, useState } from 'react';
import useToast from '../../hooks/useToast';

const Dashboard = () => {
    const navigate = useNavigate();
    const toast = useToast();
    const { user, Logout: logout, GetProfile: getProfile } = useAuthStore();

    console.log("user", user);

    const [loading, setLoading] = useState(false);

    const handleLogout = async () => {
        setLoading(true);
        try {
            await logout();
            toast.success('Logged out successfully. See you soon!');
            setTimeout(() => {
                navigate('/login');
            }, 1000);
        } catch (err) {
            toast.error('Logout failed. Please try again.');
            console.error('Logout failed:', err);
            navigate('/login');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!user) {
            const fetchProfile = async () => {
                try {
                    await getProfile();
                } catch (err) {
                    console.error('Failed to fetch profile:', err);
                }
            };
            fetchProfile();
        }
    }, [user, getProfile]);

    return (
        <div className="dashboard-container">
            <h1>Dashboard</h1>
            {user && (
                <div className="user-info">
                    <h2>Welcome, {user.firstName} {user.lastName}!</h2>
                    <p>Email: {user.email}</p>
                </div>
            )}
            <button onClick={handleLogout} disabled={loading}>
                {loading ? 'Logging out...' : 'Logout'}
            </button>
        </div>
    );
};

export default Dashboard;
