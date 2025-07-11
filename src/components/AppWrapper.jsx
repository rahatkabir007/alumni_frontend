"use client"
import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import {
    selectCurrentUser,
    initializeAuth,
    logout
} from '@/redux/features/auth/authSlice';
import { ToastMessage } from '@/utils/ToastMessage';

const AppWrapper = ({ children }) => {
    const pathname = usePathname();
    const router = useRouter();
    const dispatch = useDispatch();
    const user = useSelector(selectCurrentUser);
    const [isInitialized, setIsInitialized] = useState(false);

    // Pages where Navigation and Footer should be hidden
    const authPages = ['/login', '/register'];
    const shouldShowNavigation = !authPages.includes(pathname);

    // Define protected routes
    const protectedRoutes = ['/dashboard', '/profile'];

    useEffect(() => {
        // Check if user is already logged in on app initialization
        const initializeAuthState = () => {
            const token = localStorage.getItem('token');
            const userData = localStorage.getItem('user');

            if (token && userData) {
                try {
                    const parsedUser = JSON.parse(userData);
                    dispatch(initializeAuth({ user: parsedUser, token }));
                } catch (error) {
                    // Invalid user data, clear storage
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                }
            }

            // Mark as initialized after checking auth state
            setIsInitialized(true);
        };

        initializeAuthState();
    }, [dispatch]);

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
