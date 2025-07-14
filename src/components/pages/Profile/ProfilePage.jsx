"use client"
import { useState, useEffect } from 'react'
import { useUpdateProfileMutation, useLazyGetCurrentUserQuery } from '@/redux/features/auth/authApi'
import { useSelector } from 'react-redux'
import { selectCurrentUser, selectIsAuthenticated, selectToken } from '@/redux/features/auth/authSlice'
import { ToastMessage } from '@/utils/ToastMessage'
import BlackButton from '@/components/common/BlackButton'
import ElegantCard from '@/components/common/ElegantCard'
import BlackTag from '@/components/common/BlackTag'
import ScrollReveal from '@/components/animations/ScrollReveal'

const ProfilePage = () => {
  const user = useSelector(selectCurrentUser)
  const isAuthenticated = useSelector(selectIsAuthenticated)
  const token = useSelector(selectToken)

  const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation()
  const [triggerGetUser, { isLoading: isUserLoading }] = useLazyGetCurrentUserQuery()

  const [isEditing, setIsEditing] = useState(false)
  const [editData, setEditData] = useState({})

  // Fetch user data when component mounts
  useEffect(() => {
    if (isAuthenticated && token && !user) {
      console.log('Fetching user data on profile page mount...');
      triggerGetUser();
    }
  }, [isAuthenticated, token, user, triggerGetUser]);

  // Initialize edit data when user data is available
  useEffect(() => {
    if (user && !editData.name) {
      setEditData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        bio: user.bio || '',
        location: user.location || '',
        profession: user.profession || '',
        graduationYear: user.graduationYear || '',
        batch: user.batch || '',
      })
    }
  }, [user, editData.name])

  const handleEdit = () => {
    setIsEditing(true)
    setEditData({
      name: user.name || '',
      email: user.email || '',
      phone: user.phone || '',
      bio: user.bio || '',
      location: user.location || '',
      profession: user.profession || '',
      graduationYear: user.graduationYear || '',
      batch: user.batch || '',
    })
  }

  const handleCancel = () => {
    setIsEditing(false)
    setEditData({})
  }

  const handleInputChange = (e) => {
    setEditData({
      ...editData,
      [e.target.name]: e.target.value
    })
  }

  const handleSave = async () => {
    try {
      await updateProfile(editData).unwrap()

      // Refresh user data to get updated information
      await triggerGetUser().unwrap()

      setIsEditing(false)
      ToastMessage.notifySuccess('Profile updated successfully!')
    } catch (error) {
      console.error('Failed to update profile:', error)
      ToastMessage.notifyError(error.data?.message || 'Failed to update profile')
    }
  }

  const handleRefreshData = async () => {
    try {
      console.log('Manually refreshing user data...');
      await triggerGetUser().unwrap()
      ToastMessage.notifyInfo('Profile data refreshed!')
    } catch (error) {
      console.error('Failed to refresh user data:', error);
      ToastMessage.notifyError('Failed to refresh data')
    }
  }

  if (isUserLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <ElegantCard className="text-center max-w-md">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">No Profile Data</h2>
          <p className="text-gray-600 mb-6">Unable to load your profile information.</p>
          <BlackButton onClick={handleRefreshData}>
            Try Again
          </BlackButton>
        </ElegantCard>
      </div>
    )
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <ScrollReveal direction="up" delay={0.2}>
        <section className="py-16 bg-black text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center">
              <div>
                <BlackTag className="mb-4 bg-white text-black">Profile</BlackTag>
                <h1 className="text-4xl font-bold mb-2">
                  Welcome back, {user.name}!
                </h1>
                <p className="text-gray-300">Manage your alumni profile and information</p>
              </div>
              <div className="space-x-3">
                <BlackButton
                  variant="outline"
                  className="border-white text-white hover:bg-white hover:text-black"
                  onClick={handleRefreshData}
                  size="sm"
                  loading={isUserLoading}
                >
                  Refresh Data
                </BlackButton>
                {!isEditing && (
                  <BlackButton
                    className="bg-white text-black hover:bg-gray-200"
                    onClick={handleEdit}
                    size="sm"
                  >
                    Edit Profile
                  </BlackButton>
                )}
              </div>
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* Profile Content */}
      <ScrollReveal direction="up" delay={0.3}>
        <section className="py-12">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-3 gap-8">
              {/* Profile Summary Card */}
              <ElegantCard className="md:col-span-1">
                <div className="text-center">
                  <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-emerald-500 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                    {user.name?.charAt(0).toUpperCase() || 'A'}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{user.name}</h3>
                  <p className="text-gray-600 mb-2">{user.profession || 'Alumni Member'}</p>
                  <BlackTag variant="subtle" size="sm">
                    {user.batch ? `Batch ${user.batch}` : 'CIHS Alumni'}
                  </BlackTag>
                </div>
              </ElegantCard>

              {/* Profile Details */}
              <ElegantCard className="md:col-span-2">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-gray-900">Profile Information</h3>
                  {isEditing && (
                    <div className="space-x-2">
                      <BlackButton
                        variant="outline"
                        size="sm"
                        onClick={handleCancel}
                        disabled={isUpdating}
                      >
                        Cancel
                      </BlackButton>
                      <BlackButton
                        size="sm"
                        onClick={handleSave}
                        loading={isUpdating}
                        disabled={isUpdating}
                      >
                        Save Changes
                      </BlackButton>
                    </div>
                  )}
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {/* Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="name"
                        value={editData.name}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-black"
                      />
                    ) : (
                      <p className="text-gray-900">{user.name || 'Not provided'}</p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <p className="text-gray-900">{user.email}</p>
                    <span className="text-xs text-gray-500">Email cannot be changed</span>
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                    {isEditing ? (
                      <input
                        type="tel"
                        name="phone"
                        value={editData.phone}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-black"
                      />
                    ) : (
                      <p className="text-gray-900">{user.phone || 'Not provided'}</p>
                    )}
                  </div>

                  {/* Location */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="location"
                        value={editData.location}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-black"
                      />
                    ) : (
                      <p className="text-gray-900">{user.location || 'Not provided'}</p>
                    )}
                  </div>

                  {/* Profession */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Profession</label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="profession"
                        value={editData.profession}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-black"
                      />
                    ) : (
                      <p className="text-gray-900">{user.profession || 'Not provided'}</p>
                    )}
                  </div>

                  {/* Graduation Year */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Graduation Year</label>
                    {isEditing ? (
                      <input
                        type="number"
                        name="graduationYear"
                        value={editData.graduationYear}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-black"
                      />
                    ) : (
                      <p className="text-gray-900">{user.graduationYear || 'Not provided'}</p>
                    )}
                  </div>

                  {/* Bio */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                    {isEditing ? (
                      <textarea
                        name="bio"
                        rows={4}
                        value={editData.bio}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-black resize-none"
                        placeholder="Tell us about yourself..."
                      />
                    ) : (
                      <p className="text-gray-900">{user.bio || 'No bio provided'}</p>
                    )}
                  </div>
                </div>

                {/* Account Information */}
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Account Information</h4>
                  <div className="grid md:grid-cols-2 gap-6 text-sm">
                    <div>
                      <span className="text-gray-500">User ID:</span>
                      <span className="ml-2 text-gray-900">{user.id}</span>
                    </div>
                    {user.provider && (
                      <div>
                        <span className="text-gray-500">Login Provider:</span>
                        <span className="ml-2 text-gray-900 capitalize">{user.provider}</span>
                      </div>
                    )}
                    <div>
                      <span className="text-gray-500">Member Since:</span>
                      <span className="ml-2 text-gray-900">
                        {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                      </span>
                    </div>
                  </div>
                </div>
              </ElegantCard>
            </div>
          </div>
        </section>
      </ScrollReveal>
    </div>
  )
}

export default ProfilePage