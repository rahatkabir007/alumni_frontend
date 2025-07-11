"use client"
import { useEffect } from 'react';
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

    // Pages where Navigation and Footer should be hidden
    const authPages = ['/login', '/register'];
    const shouldShowNavigation = !authPages.includes(pathname);

    useEffect(() => {
        // Check if user is already logged in on app initialization
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
    }, [dispatch]);

    const handleLogout = () => {
        dispatch(logout());
        ToastMessage.notifySuccess('Logged out successfully');
        router.push('/');
    };

    return (
        <div className="min-h-screen flex flex-col">
            {shouldShowNavigation && (
                <Navigation user={user} onLogout={handleLogout} />
            )}

            <main className="flex-grow">
                {children}
            </main>

            {shouldShowNavigation && <Footer />}
        </div>
    );
};

export default AppWrapper;
