"use client"
import ProtectedRoute from '@/components/ProtectedRoute'
import { useSelector } from 'react-redux'
import { selectCurrentUser } from '@/redux/features/auth/authSlice'


const DashboardPage = () => {
  const user = useSelector(selectCurrentUser)
  return (
    <ProtectedRoute>
      <div className="bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            Welcome back, {user?.name}!
          </h1>
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Dashboard Content</h2>
            <p className="text-gray-600">This is your protected dashboard page.</p>

            {user && (
              <div className="mt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Profile Information</h3>
                <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Name</dt>
                    <dd className="mt-1 text-sm text-gray-900">{user.name}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Email</dt>
                    <dd className="mt-1 text-sm text-gray-900">{user.email}</dd>
                  </div>
                  {user.provider && (
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Login Provider</dt>
                      <dd className="mt-1 text-sm text-gray-900 capitalize">{user.provider}</dd>
                    </div>
                  )}
                  {user.id && (
                    <div>
                      <dt className="text-sm font-medium text-gray-500">User ID</dt>
                      <dd className="mt-1 text-sm text-gray-900">{user.id}</dd>
                    </div>
                  )}
                </dl>
              </div>
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}

export default DashboardPage