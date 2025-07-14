"use client"
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import { selectIsAuthenticated, setRedirectPath, initializeAuth } from '@/redux/features/auth/authSlice';
import { ToastMessage } from '@/utils/ToastMessage';
import FullScreenLoader from './Loader/FullScreenLoader';


const ProtectedRoute = ({ children }) => {
    const router = useRouter();
    const pathname = usePathname();
    const dispatch = useDispatch();
    const isAuthenticated = useSelector(selectIsAuthenticated);
    const [isLoading, setIsLoading] = useState(true);
    const [hasCheckedAuth, setHasCheckedAuth] = useState(false);

    useEffect(() => {
        const checkAuth = () => {
            // Check for stored authentication data
            const token = localStorage.getItem('token');
            const userData = localStorage.getItem('user');

            if (token && userData) {
                try {
                    const user = JSON.parse(userData);
                    dispatch(initializeAuth({ user, token }));
                } catch (error) {
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                }
            }

            setIsLoading(false);
            setHasCheckedAuth(true);
        };

        checkAuth();
    }, [dispatch]);

    useEffect(() => {
        if (hasCheckedAuth && !isLoading && !isAuthenticated) {
            // Only set redirect path if user was not just logged out
            const isFromLogout = sessionStorage.getItem('justLoggedOut');

            if (!isFromLogout) {
                // Store the current path for redirect after login
                dispatch(setRedirectPath(pathname));
                ToastMessage.notifyError('Please login first to access this page');
            }

            // Clear the logout flag
            sessionStorage.removeItem('justLoggedOut');
        }
    }, [isAuthenticated, isLoading, hasCheckedAuth, pathname, dispatch, router]);

    if (isLoading || !hasCheckedAuth) {
        return <FullScreenLoader />;
    }

    if (!isAuthenticated) {
        return <FullScreenLoader />;
    }

    return children;
};

export default ProtectedRoute;
