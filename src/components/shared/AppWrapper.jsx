"use client"
import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import {
    selectCurrentUser,
    selectIsAuthenticated,
    selectToken,
    initializeAuth,
    logout
} from '@/redux/features/auth/authSlice';
import { useLazyGetCurrentUserQuery } from '@/redux/features/auth/authApi';
import { ToastMessage } from '@/utils/ToastMessage';
import Navigation from './Navigation';
import Footer from './Footer';

const AppWrapper = ({ children }) => {
    const pathname = usePathname();
    const router = useRouter();
    const dispatch = useDispatch();
    const user = useSelector(selectCurrentUser);
    const isAuthenticated = useSelector(selectIsAuthenticated);
    const token = useSelector(selectToken);
    const [isInitialized, setIsInitialized] = useState(false);

    // Lazy query for fetching user data
    const [triggerGetUser, { data: userData, isLoading: isFetchingUser }] = useLazyGetCurrentUserQuery();

    // Pages where Navigation and Footer should be hidden
    const authPages = ['/login', '/register'];
    const shouldShowNavigation = !authPages.includes(pathname);

    // Define protected routes
    const protectedRoutes = ['/dashboard', '/profile'];

    useEffect(() => {
        // Check if user is already logged in on app initialization
        const initializeAuthState = async () => {
            const storedToken = localStorage.getItem('token');
            const storedUser = localStorage.getItem('user');

            if (storedToken && storedUser) {
                try {
                    const parsedUser = JSON.parse(storedUser);
                    dispatch(initializeAuth({ user: parsedUser, token: storedToken }));

                    // Fetch fresh user data to ensure we have the latest information
                    await triggerGetUser();
                } catch (error) {
                    console.error('Error initializing auth:', error);
                    // Invalid stored data, clear it
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                }
            }

            // Mark as initialized after checking auth state
            setIsInitialized(true);
        };

        initializeAuthState();
    }, [dispatch, triggerGetUser]);

    // Update user data when API call completes
    useEffect(() => {
        if (userData) {
            dispatch(initializeAuth({
                user: userData,
                token: token || localStorage.getItem('token')
            }));
        }
    }, [userData, dispatch, token]);

    // Auto-fetch user data when authenticated but user data is missing
    useEffect(() => {
        if (isAuthenticated && token && !user && !isFetchingUser) {
            triggerGetUser();
        }
    }, [isAuthenticated, token, user, triggerGetUser, isFetchingUser]);

    const handleLogout = () => {
        // Set flag to indicate this is a logout action
        sessionStorage.setItem('justLoggedOut', 'true');

        dispatch(logout());
        ToastMessage.notifySuccess('Logged out successfully');

        // Check if current route is protected
        const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));

        if (isProtectedRoute) {
            // If on a protected route, redirect to homepage
            router.push('/');
        } else {
            // If on a non-protected route, stay on the same route
            router.refresh(); // Refresh to update the UI state
        }
    };

    return (
        <div className="min-h-screen flex flex-col">
            {shouldShowNavigation && (
                <Navigation user={user} onLogout={handleLogout} isInitialized={isInitialized} />
            )}

            <main className="flex-grow">
                {children}
            </main>

            {shouldShowNavigation && <Footer />}
        </div>
    );
};

export default AppWrapper;
