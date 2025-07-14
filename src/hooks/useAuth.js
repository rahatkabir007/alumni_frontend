"use client"
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    useGetCurrentUserQuery,
    useLazyGetCurrentUserQuery
} from '@/redux/features/auth/authApi';
import {
    updateUserData,
    selectCurrentUser,
    selectToken,
    selectIsAuthenticated,
    selectLastFetched
} from '@/redux/features/auth/authSlice';

export const useAuth = () => {
    const dispatch = useDispatch();
    const user = useSelector(selectCurrentUser);
    const token = useSelector(selectToken);
    const isAuthenticated = useSelector(selectIsAuthenticated);
    const lastFetched = useSelector(selectLastFetched);

    // Auto-fetch user data if authenticated but no user data
    const shouldFetchUser = isAuthenticated && token && !user;

    const {
        data: userData,
        error: userError,
        isLoading: isUserLoading,
        refetch: refetchUser
    } = useGetCurrentUserQuery(undefined, {
        skip: !shouldFetchUser,
        refetchOnMountOrArgChange: 30, // Refetch if data is older than 30 seconds
    });

    // Manual fetch function for on-demand updates
    const [triggerFetchUser, {
        data: manualUserData,
        isLoading: isManualLoading
    }] = useLazyGetCurrentUserQuery();

    // Update global state when user data is fetched
    useEffect(() => {
        if (userData) {
            dispatch(updateUserData(userData));
        }
    }, [userData, dispatch]);

    // Update global state when manual fetch completes
    useEffect(() => {
        if (manualUserData) {
            dispatch(updateUserData(manualUserData));
        }
    }, [manualUserData, dispatch]);

    // Refresh user data function
    const refreshUserData = async () => {
        if (isAuthenticated && token) {
            try {
                await triggerFetchUser().unwrap();
            } catch (error) {
                console.error('Failed to refresh user data:', error);
                throw error;
            }
        }
    };

    // Check if user data is stale (older than 5 minutes)
    const isUserDataStale = () => {
        if (!lastFetched) return true;
        const fiveMinutesAgo = Date.now() - (5 * 60 * 1000);
        return lastFetched < fiveMinutesAgo;
    };

    return {
        user,
        token,
        isAuthenticated,
        isUserLoading: isUserLoading || isManualLoading,
        userError,
        refreshUserData,
        refetchUser,
        isUserDataStale: isUserDataStale(),
        lastFetched
    };
};

export default useAuth;
