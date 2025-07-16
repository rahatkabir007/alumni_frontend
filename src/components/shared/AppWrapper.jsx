"use client"
import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import {
    selectCurrentUser,
    selectIsAuthenticated,
    selectToken,
    initializeAuth,
    logout,
    setCredentials
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
        if (userData && token) {
            // Use setCredentials to update both user and token in Redux store
            dispatch(setCredentials({
                user: userData,
                token: token
            }));
            console.log('Updated user data in Redux:', userData);
        }
    }, [userData, dispatch, token]);

    // Auto-fetch user data when authenticated but user data is missing
    useEffect(() => {
        if (isAuthenticated && token && !user && !isFetchingUser) {
            triggerGetUser().catch(error => {
                // Don't logout on API errors in AppWrapper, just log them
                console.warn('Failed to fetch user data in AppWrapper:', error);
            });
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
                <Navigation
                    user={userData || user}
                    onLogout={handleLogout}
                    isInitialized={isInitialized}
                />
            )}

            <main className="flex-grow">
                {children}
            </main>

            {shouldShowNavigation && <Footer />}
        </div>
    );
};

export default AppWrapper;
