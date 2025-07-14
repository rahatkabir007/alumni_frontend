"use client";

import ProfilePage from '@/components/pages/Profile/ProfilePage'
import ProtectedRoute from '@/components/shared/ProtectedRoute';


const page = () => {
    return (
        <ProtectedRoute>
            <ProfilePage />
        </ProtectedRoute>
    )
}

export default page