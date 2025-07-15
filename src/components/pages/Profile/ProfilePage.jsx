"use client"
import { useState, useEffect } from 'react'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import { useUpdateProfileMutation, useLazyGetCurrentUserQuery } from '@/redux/features/auth/authApi'
import { useSelector, useDispatch } from 'react-redux'
import { selectIsAuthenticated, selectToken, logout } from '@/redux/features/auth/authSlice'
import { ToastMessage } from '@/utils/ToastMessage'
import BlackButton from '@/components/common/BlackButton'
import ElegantCard from '@/components/common/ElegantCard'
import BlackTag from '@/components/common/BlackTag'
import ScrollReveal from '@/components/animations/ScrollReveal'
import InputComponent1 from '@/components/common/InputComponent1'
import TextareaComponent1 from '@/components/common/TextareaComponent1'
import { useRouter } from 'next/navigation'

const ProfileSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be less than 50 characters')
    .required('Name is required'),
  phone: Yup.string()
    .matches(/^[\+]?[0-9\s\-\(\)]*$/, 'Invalid phone number format')
    .min(10, 'Phone number must be at least 10 digits'),
  bio: Yup.string()
    .max(500, 'Bio must be less than 500 characters'),
  location: Yup.string()
    .max(100, 'Location must be less than 100 characters'),
  profession: Yup.string()
    .max(100, 'Profession must be less than 100 characters'),
  graduationYear: Yup.number()
    .min(1950, 'Graduation year must be after 1950')
    .max(new Date().getFullYear(), 'Graduation year cannot be in the future'),
  batch: Yup.string()
    .max(20, 'Batch must be less than 20 characters')
});

const ProfilePage = () => {
  const dispatch = useDispatch()
  const router = useRouter()
  const isAuthenticated = useSelector(selectIsAuthenticated)
  const token = useSelector(selectToken)

  const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation()
  const [triggerGetUser, { isLoading: isUserLoading }] = useLazyGetCurrentUserQuery()

  const [isEditing, setIsEditing] = useState(false)
  const [userData, setUserData] = useState(null)
  const [fetchError, setFetchError] = useState(null)

  // Fetch user data when component mounts
  useEffect(() => {
    const fetchUserData = async () => {
      if (isAuthenticated && token) {
        try {
          console.log('Fetching user data on profile page mount...');
          const result = await triggerGetUser().unwrap()
          setUserData(result)
          setFetchError(null)
        } catch (error) {
          console.error('Failed to fetch user data:', error);
          setFetchError(error)

          // If it's an authentication error, clear token and redirect
          if (error.status === 401 || error.status === 403) {
            console.log('Authentication failed, clearing token and redirecting...');
            dispatch(logout())

            // Clear localStorage and sessionStorage
            localStorage.clear()
            sessionStorage.clear()

            ToastMessage.notifyError('Session expired. Please login again.')
            router.push('/login')
          } else {
            ToastMessage.notifyError('Failed to load profile data')
          }
        }
      }
    }

    fetchUserData()
  }, [isAuthenticated, token, triggerGetUser, dispatch, router]);

  const handleEdit = () => {
    setIsEditing(true)
  }

  const handleCancel = () => {
    setIsEditing(false)
  }

  const handleSave = async (values, { setSubmitting }) => {
    try {
      await updateProfile(values).unwrap()

      // Refresh user data to get updated information
      const result = await triggerGetUser().unwrap()
      setUserData(result)

      setIsEditing(false)
      ToastMessage.notifySuccess('Profile updated successfully!')
    } catch (error) {
      console.error('Failed to update profile:', error)

      // Handle authentication errors during update
      if (error.status === 401 || error.status === 403) {
        dispatch(logout())
        localStorage.clear()
        sessionStorage.clear()
        ToastMessage.notifyError('Session expired. Please login again.')
        router.push('/login')
      } else {
        ToastMessage.notifyError(error.data?.message || 'Failed to update profile')
      }
    } finally {
      setSubmitting(false)
    }
  }

  const handleRefreshData = async () => {
    try {
      console.log('Manually refreshing user data...');
      const result = await triggerGetUser().unwrap()
      setUserData(result)
      setFetchError(null)
      ToastMessage.notifyInfo('Profile data refreshed!')
    } catch (error) {
      console.error('Failed to refresh user data:', error);
      setFetchError(error)

      if (error.status === 401 || error.status === 403) {
        dispatch(logout())
        localStorage.clear()
        sessionStorage.clear()
        ToastMessage.notifyError('Session expired. Please login again.')
        router.push('/login')
      } else {
        ToastMessage.notifyError('Failed to refresh data')
      }
    }
  }

  const handleRetry = () => {
    setFetchError(null)
    handleRefreshData()
  }

  // Show loading state
  if (isUserLoading && !userData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    )
  }

  // Show error state
  if (fetchError && !userData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <ElegantCard className="text-center max-w-md">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Failed to Load Profile</h2>
          <p className="text-gray-600 mb-6">
            {fetchError.status === 401 || fetchError.status === 403
              ? 'Your session has expired. Please login again.'
              : 'Unable to load your profile information. Please try again.'}
          </p>
          <div className="flex gap-3 justify-center">
            <BlackButton onClick={handleRetry} disabled={isUserLoading}>
              {isUserLoading ? 'Retrying...' : 'Try Again'}
            </BlackButton>
            <BlackButton
              variant="outline"
              onClick={() => router.push('/login')}
            >
              Go to Login
            </BlackButton>
          </div>
        </ElegantCard>
      </div>
    )
  }

  // Show no data state
  if (!userData) {
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
                  Welcome back, {userData.name}!
                </h1>
                <p className="text-gray-300">Manage your alumni profile and information</p>
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
                    {userData.name?.charAt(0).toUpperCase() || 'A'}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{userData.name}</h3>
                  <p className="text-gray-600 mb-2">{userData.profession || 'Alumni Member'}</p>
                  <BlackTag variant="subtle" size="sm">
                    {userData.batch ? `Batch ${userData.batch}` : 'CIHS Alumni'}
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
                    </div>
                  )}
                  {!isEditing && (
                    <BlackButton
                      size="sm"
                      onClick={handleEdit}
                    >
                      Edit Profile
                    </BlackButton>
                  )}
                </div>

                {isEditing ? (
                  <Formik
                    initialValues={{
                      name: userData.name || '',
                      phone: userData.phone || '',
                      bio: userData.bio || '',
                      location: userData.location || '',
                      profession: userData.profession || '',
                      graduationYear: userData.graduationYear || '',
                      batch: userData.batch || '',
                    }}
                    validationSchema={ProfileSchema}
                    onSubmit={handleSave}
                  >
                    {({ isSubmitting }) => (
                      <Form>
                        <div className="grid md:grid-cols-2 gap-6">
                          {/* Name */}
                          <InputComponent1
                            name="name"
                            label="Full Name"
                            required
                            useFormik={true}
                            backgroundColor="bg-white"
                            borderColor="border-gray-300"
                            textColor="text-gray-900"
                            focusBorderColor="focus:border-black"
                            focusRingColor="focus:ring-black/10"
                          />

                          {/* Email - Always disabled */}
                          <div>
                            <InputComponent1
                              name="email"
                              label="Email"
                              value={userData.email}
                              disabled={true}
                              backgroundColor="bg-gray-50"
                              borderColor="border-transparent"
                              textColor="text-gray-900"
                              className="cursor-default"
                            />
                            <span className="text-xs text-gray-500">Email cannot be changed</span>
                          </div>

                          {/* Phone */}
                          <InputComponent1
                            name="phone"
                            type="tel"
                            label="Phone"
                            useFormik={true}
                            backgroundColor="bg-white"
                            borderColor="border-gray-300"
                            textColor="text-gray-900"
                            focusBorderColor="focus:border-black"
                            focusRingColor="focus:ring-black/10"
                          />

                          {/* Location */}
                          <InputComponent1
                            name="location"
                            label="Location"
                            useFormik={true}
                            backgroundColor="bg-white"
                            borderColor="border-gray-300"
                            textColor="text-gray-900"
                            focusBorderColor="focus:border-black"
                            focusRingColor="focus:ring-black/10"
                          />

                          {/* Profession */}
                          <InputComponent1
                            name="profession"
                            label="Profession"
                            useFormik={true}
                            backgroundColor="bg-white"
                            borderColor="border-gray-300"
                            textColor="text-gray-900"
                            focusBorderColor="focus:border-black"
                            focusRingColor="focus:ring-black/10"
                          />

                          {/* Graduation Year */}
                          <InputComponent1
                            name="graduationYear"
                            type="number"
                            label="Graduation Year"
                            useFormik={true}
                            backgroundColor="bg-white"
                            borderColor="border-gray-300"
                            textColor="text-gray-900"
                            focusBorderColor="focus:border-black"
                            focusRingColor="focus:ring-black/10"
                          />

                          {/* Bio */}
                          <div className="md:col-span-2">
                            <TextareaComponent1
                              name="bio"
                              label="Bio"
                              useFormik={true}
                              rows={4}
                              maxLength={500}
                              showCharCount={true}
                              placeholder="Tell us about yourself..."
                              backgroundColor="bg-white"
                              borderColor="border-gray-300"
                              textColor="text-gray-900"
                              focusBorderColor="focus:border-black"
                              focusRingColor="focus:ring-black/10"
                              resize="resize-none"
                            />
                          </div>
                        </div>

                        <div className="mt-6 flex justify-end">
                          <BlackButton
                            type="submit"
                            size="sm"
                            loading={isSubmitting || isUpdating}
                            disabled={isSubmitting || isUpdating}
                          >
                            Save Changes
                          </BlackButton>
                        </div>
                      </Form>
                    )}
                  </Formik>
                ) : (
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Read-only view */}
                    <InputComponent1
                      name="name"
                      label="Full Name"
                      value={userData.name || 'Not provided'}
                      disabled={true}
                      backgroundColor="bg-gray-50"
                      borderColor="border-transparent"
                      textColor="text-gray-900"
                      className="cursor-default"
                    />

                    <div>
                      <InputComponent1
                        name="email"
                        label="Email"
                        value={userData.email}
                        disabled={true}
                        backgroundColor="bg-gray-50"
                        borderColor="border-transparent"
                        textColor="text-gray-900"
                        className="cursor-default"
                      />
                    </div>

                    {/* Phone */}
                    <InputComponent1
                      name="phone"
                      label="Phone"
                      value={userData.phone || 'Not provided'}
                      disabled={true}
                      backgroundColor="bg-gray-50"
                      borderColor="border-transparent"
                      textColor="text-gray-900"
                      className="cursor-default"
                    />

                    {/* Location */}
                    <InputComponent1
                      name="location"
                      label="Location"
                      value={userData.location || 'Not provided'}
                      disabled={true}
                      backgroundColor="bg-gray-50"
                      borderColor="border-transparent"
                      textColor="text-gray-900"
                      className="cursor-default"
                    />

                    {/* Profession */}
                    <InputComponent1
                      name="profession"
                      label="Profession"
                      value={userData.profession || 'Not provided'}
                      disabled={true}
                      backgroundColor="bg-gray-50"
                      borderColor="border-transparent"
                      textColor="text-gray-900"
                      className="cursor-default"
                    />

                    {/* Graduation Year */}
                    <InputComponent1
                      name="graduationYear"
                      type="number"
                      label="Graduation Year"
                      value={userData.graduationYear || 'Not provided'}
                      disabled={true}
                      backgroundColor="bg-gray-50"
                      borderColor="border-transparent"
                      textColor="text-gray-900"
                      className="cursor-default"
                    />

                    {/* Bio */}
                    <div className="md:col-span-2">
                      <TextareaComponent1
                        name="bio"
                        label="Bio"
                        value={userData.bio || 'No bio provided'}
                        disabled={true}
                        rows={4}
                        backgroundColor="bg-gray-50"
                        borderColor="border-transparent"
                        textColor="text-gray-900"
                        className="cursor-default"
                        resize="resize-none"
                      />
                    </div>
                  </div>
                )}

                {/* Account Information */}
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Account Information</h4>
                  <div className="grid md:grid-cols-2 gap-6 text-sm">
                    <div>
                      <span className="text-gray-500">User ID:</span>
                      <span className="ml-2 text-gray-900">{userData.id}</span>
                    </div>
                    {userData.provider && (
                      <div>
                        <span className="text-gray-500">Login Provider:</span>
                        <span className="ml-2 text-gray-900 capitalize">{userData.provider}</span>
                      </div>
                    )}
                    <div>
                      <span className="text-gray-500">Member Since:</span>
                      <span className="ml-2 text-gray-900">
                        {userData.createdAt ? new Date(userData.createdAt).toLocaleDateString() : 'N/A'}
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