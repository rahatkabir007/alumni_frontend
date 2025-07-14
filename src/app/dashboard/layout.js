"use client";

import ProtectedRoute from "@/components/shared/ProtectedRoute";

const DashboardLayout = ({
    children
}) => {
    return (
        <ProtectedRoute>
            {children}
        </ProtectedRoute>
    )
}

export default DashboardLayout