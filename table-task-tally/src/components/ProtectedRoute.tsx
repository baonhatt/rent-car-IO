import { Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { refreshToken } from '../api/authAPI';

const ProtectedRoute = () => {
    const [isValidating, setIsValidating] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const location = useLocation();
    const navigate = useNavigate()
    const isTokenExpired = (token: string) => {
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            return payload.exp * 1000 < Date.now();
        } catch (error) {
            return true;
        }
    };

    const handleRefreshToken = async () => {
        try {
            const refreshTokenValue = localStorage.getItem('refreshToken');
            if (!refreshTokenValue) {
                throw new Error('No refresh token available');
            }

            const response = await refreshToken(refreshTokenValue);
            localStorage.setItem('accessToken', response.accessToken);
            setIsAuthenticated(true);
        } catch (error) {
            console.error('Failed to refresh token:', error);
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('user');
            setIsAuthenticated(false);
        }
    };

    useEffect(() => {
        const validateToken = async () => {
            const token = localStorage.getItem('accessToken');
            if (token) {
                if (isTokenExpired(token)) {
                    await handleRefreshToken();
                } else {
                    setIsAuthenticated(true);
                }
            } else {
                setIsAuthenticated(false);
                navigate('/')
            }
            setIsValidating(false);
        };

        validateToken();
    }, []);

    if (isValidating) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/" state={{ from: location }} replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute; 