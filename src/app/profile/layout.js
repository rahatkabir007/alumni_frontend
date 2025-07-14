"use client";

import ProtectedRoute from "@/components/shared/ProtectedRoute";

const ProfileLayout = ({
    children
}) => {
    return (
        <ProtectedRoute>
            {children}
        </ProtectedRoute>
    )
}

export default ProfileLayout