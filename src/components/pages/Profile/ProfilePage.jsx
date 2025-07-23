"use client"
import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { selectCurrentUser, selectIsAuthenticated, selectToken, logout, setCredentials } from '@/redux/features/auth/authSlice'
import { useLazyGetCurrentUserQuery } from '@/redux/features/auth/authApi'
import { ToastMessage } from '@/utils/ToastMessage'
import { useRouter } from 'next/navigation'
import ElegantCard from '@/components/common/ElegantCard'
import BlackButton from '@/components/common/BlackButton'
import ProfileSidebar from './components/ProfileSidebar'
import BasicInfo from './components/BasicInfo'
import BlogManagement from './components/BlogManagement'
import EventManagement from './components/EventManagement'
import GalleryManagement from './components/GalleryManagement'
import ReviewsTestimonials from './components/ReviewsTestimonials'
import UserManagement from './components/UserManagement'
import AnnouncementManagement from './components/AnnouncementManagement'
import { checkUserPermission, PERMISSIONS } from '@/utils/rolePermissions'

const ProfilePage = () => {
  const dispatch = useDispatch()
  const router = useRouter()
  const currentUser = useSelector(selectCurrentUser)
  const isAuthenticated = useSelector(selectIsAuthenticated)
  const token = useSelector(selectToken)

  const [triggerGetUser, { isLoading: isUserLoading }] = useLazyGetCurrentUserQuery()

  const [activeSection, setActiveSection] = useState('basic-info')
  const [hasTriedFetch, setHasTriedFetch] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)

  // Debug log to see current user state
  useEffect(() => {
  }, [currentUser, isAuthenticated, token]);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated && !token) {
      console.log('Not authenticated and no token, redirecting to login...');
      router.push('/login')
      return
    }
  }, [isAuthenticated, token, router])

  // Fetch user data if we have token but no user data
  useEffect(() => {
    const fetchUserDataIfNeeded = async () => {
      // Check if we have token but no user data
      const storedToken = token || localStorage.getItem('token');

      if (storedToken && !currentUser && !hasTriedFetch && !isUserLoading) {
        console.log('Profile Page - Have token but no user data, fetching...');
        setHasTriedFetch(true)

        try {
          console.log('Profile Page - Fetching user data...');
          const result = await triggerGetUser().unwrap()
          console.log('Profile Page - User data fetched successfully:', result);

          // Set credentials with the fetched user data and stored token
          dispatch(setCredentials({
            user: result,
            token: storedToken
          }));

        } catch (error) {
          console.error('Profile Page - Failed to fetch user data:', error);

          // Only logout on authentication errors
          if (error.status === 401 || error.status === 403) {
            console.log('Profile Page - Authentication failed, logging out...');
            dispatch(logout())
            ToastMessage.notifyError('Session expired. Please login again.')
            router.push('/login')
          } else {
            ToastMessage.notifyWarning('Failed to load profile data')
          }
        }
      }
    }

    fetchUserDataIfNeeded()
  }, [currentUser, token, hasTriedFetch, isUserLoading, triggerGetUser, dispatch, router])

  const handleRefreshData = async () => {
    try {
      setIsRefreshing(true)
      const result = await triggerGetUser().unwrap()

      const storedToken = token || localStorage.getItem('token');
      dispatch(setCredentials({
        user: result,
        token: storedToken
      }));

      // ToastMessage.notifyInfo('Profile data refreshed!')
    } catch (error) {
      console.error('Profile Page - Failed to refresh user data:', error);

      if (error.status === 401 || error.status === 403) {
        dispatch(logout())
        ToastMessage.notifyError('Session expired. Please login again.')
        router.push('/login')
      } else {
        ToastMessage.notifyError('Failed to refresh data')
      }
    } finally {
      setIsRefreshing(false)
    }
  }

  const handleUserUpdate = (updatedData) => {
    const storedToken = token || localStorage.getItem('token');
    dispatch(setCredentials({
      user: { ...currentUser, ...updatedData },
      token: storedToken
    }));
  }

  const renderActiveSection = () => {
    if (!currentUser) {
      console.log('No current user, not rendering section');
      return null;
    }

    switch (activeSection) {
      case 'basic-info':
        return <BasicInfo userData={currentUser} onUpdate={handleUserUpdate} refetch={handleRefreshData} />
      case 'blogs':
        return <BlogManagement userData={currentUser} />
      case 'events':
        return <EventManagement userData={currentUser} />
      case 'gallery':
        return <GalleryManagement userData={currentUser} />
      case 'reviews':
        return <ReviewsTestimonials userData={currentUser} />
      case 'users':
        return checkUserPermission(currentUser.roles, PERMISSIONS.MANAGE_USERS) ?
          <UserManagement userData={currentUser} /> : null
      case 'announcements':
        return checkUserPermission(currentUser.roles, PERMISSIONS.MANAGE_ANNOUNCEMENTS) ?
          <AnnouncementManagement userData={currentUser} /> : null
      default:
        return <BasicInfo userData={currentUser} onUpdate={handleUserUpdate} />
    }
  }

  // Don't render anything if not authenticated and no token
  if (!isAuthenticated && !token && !localStorage.getItem('token')) {
    return null
  }

  // Show loading if we're fetching and have no data
  if ((isUserLoading || !hasTriedFetch) && !currentUser) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    )
  }

  // Show error state if we have no user data after trying to fetch
  if (!currentUser && hasTriedFetch && !isUserLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <ElegantCard className="text-center max-w-md" hover={false} initial={{ opacity: 0, y: 0 }}>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">No Profile Data</h2>
          <p className="text-gray-600 mb-6">Unable to load your profile information.</p>
          <div className="space-y-2 text-sm text-gray-500 mb-4">
            <p>Debug Info:</p>
            <p>Authenticated: {isAuthenticated ? 'Yes' : 'No'}</p>
            <p>Token: {(token || localStorage.getItem('token')) ? 'Present' : 'Missing'}</p>
            <p>Has Tried Fetch: {hasTriedFetch ? 'Yes' : 'No'}</p>
            <p>Loading: {isUserLoading ? 'Yes' : 'No'}</p>
          </div>
          <BlackButton onClick={() => {
            handleRefreshData()
            ToastMessage.notifyInfo('Profile data refreshed!')
          }}>
            Try Again
          </BlackButton>
        </ElegantCard>
      </div>
    )
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <ProfileSidebar
              userData={currentUser}
              activeSection={activeSection}
              onSectionChange={setActiveSection}
              onRefresh={handleRefreshData}
              isRefreshing={isRefreshing}
            />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {isRefreshing ? (
              <ElegantCard hover={false} initial={{ opacity: 0, y: 0 }}>
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mx-auto mb-4"></div>
                  <p className="text-gray-600">Refreshing profile data...</p>
                </div>
              </ElegantCard>
            ) : (
              renderActiveSection()
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage