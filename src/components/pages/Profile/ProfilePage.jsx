"use client"
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useRouter } from 'next/navigation'
import { selectCurrentUser, selectIsAuthenticated, selectToken, setCredentials, logout } from '@/redux/features/auth/authSlice'
import { setHasTriedFetch } from '@/redux/features/profile/profileSlice'
import { useProfile } from '@/hooks/useProfile'
import { ToastMessage } from '@/utils/ToastMessage'
import ProfileSidebar from './components/ProfileSidebar'
import BasicInfo from './components/RegularUserComponents/BasicInfo/BasicInfo'
import Gallery from './components/RegularUserComponents/Gallery/Gallery'
import AdditionalInfo from './components/RegularUserComponents/AdditionalInfo/AdditionalInfo'
import UserManagement from './components/AdminComponents/UserManagement/UserManagement'
import GalleryManagement from './components/AdminComponents/GalleryManagement/GalleryManagement'
import BlogManagement from './components/AdminComponents/BlogManagement/BlogManagement'
import EventManagement from './components/AdminComponents/EventManagement/EventManagement'
import AnnouncementManagement from './components/AdminComponents/Announcements/AnnouncementManagement'
import { useLazyGetCurrentUserQuery } from '@/redux/features/auth/authApi'

const ProfilePage = () => {
  const dispatch = useDispatch()
  const router = useRouter()
  const currentUser = useSelector(selectCurrentUser)
  const isAuthenticated = useSelector(selectIsAuthenticated)
  const token = useSelector(selectToken)

  const [triggerGetUser, { isLoading: isUserLoading }] = useLazyGetCurrentUserQuery()

  // Use profile hook with error handling
  const {
    activeSection,
    isRefreshing,
    hasTriedFetch,
    handleSectionChange,
    handleRefreshData,
    handleUserUpdate
  } = useProfile()

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
      const storedToken = token || localStorage.getItem('token');

      if (storedToken && !currentUser && !hasTriedFetch && !isUserLoading) {
        console.log('Profile Page - Have token but no user data, fetching...');
        dispatch(setHasTriedFetch(true))

        try {
          console.log('Profile Page - Fetching user data...');
          const result = await triggerGetUser().unwrap()
          console.log('Profile Page - User data fetched successfully:', result);

          dispatch(setCredentials({
            user: result,
            token: storedToken
          }));

        } catch (error) {
          console.error('Profile Page - Failed to fetch user data:', error);

          if (error.status === 401 || error.status === 403) {
            dispatch(logout())
            ToastMessage.notifyError('Session expired. Please login again.')
            router.push('/login')
          } else {
            ToastMessage.notifyError('Failed to refresh data')
          }
        }
      }
    }

    fetchUserDataIfNeeded()
  }, [currentUser, token, hasTriedFetch, isUserLoading, triggerGetUser, dispatch, router])

  const renderContent = () => {
    switch (activeSection) {
      case 'basic-info':
        return (
          <BasicInfo
            userData={currentUser}
            onUpdate={handleUserUpdate}
            refetch={handleRefreshData}
          />
        )
      case 'additional-info':
        return (
          <AdditionalInfo
            userData={currentUser}
            onUpdate={handleUserUpdate}
            refetch={handleRefreshData}
          />
        )
      case 'gallery':
        return <Gallery userData={currentUser} />
      case 'users':
        return <UserManagement userData={currentUser} />
      case 'gallery_management':
        return <GalleryManagement userData={currentUser} />
      case 'blog_management':
        return <BlogManagement userData={currentUser} />
      case 'event_management':
        return <EventManagement userData={currentUser} />
      case 'announcement_management':
        return <AnnouncementManagement userData={currentUser} />
      default:
        return (
          <BasicInfo
            userData={currentUser}
            onUpdate={handleUserUpdate}
            refetch={handleRefreshData}
          />
        )
    }
  }

  // Don't render anything if not authenticated and no token
  if (!isAuthenticated && !token && !localStorage.getItem('token')) {
    return null
  }

  // Show loading if we're fetching and have no data
  if ((isUserLoading || !hasTriedFetch) && !currentUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your profile...</p>
          </div>
        </div>
      </div>
    )
  }

  // Show error state if we have no user data after trying to fetch
  if (!currentUser && hasTriedFetch && !isUserLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <div className="text-red-400 text-4xl mb-4">⚠️</div>
            <h4 className="text-lg font-semibold text-gray-900 mb-2">Failed to Load Profile</h4>
            <p className="text-gray-600 mb-4">There was an error loading your profile data.</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
            >
              Refresh Page
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <ProfileSidebar
              userData={currentUser}
              activeSection={activeSection}
              onSectionChange={handleSectionChange}
              onRefresh={handleRefreshData}
            />
          </div>

          <div className="lg:col-span-3">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage