"use client"
import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { selectIsAuthenticated, selectToken, logout } from '@/redux/features/auth/authSlice'
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
  const isAuthenticated = useSelector(selectIsAuthenticated)
  const token = useSelector(selectToken)

  const [triggerGetUser, { isLoading: isUserLoading }] = useLazyGetCurrentUserQuery()

  const [userData, setUserData] = useState(null)
  const [fetchError, setFetchError] = useState(null)
  const [activeSection, setActiveSection] = useState('basic-info')

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

  const handleRetry = () => {
    setFetchError(null)
    handleRefreshData()
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

  const renderActiveSection = () => {
    if (!userData) return null

    switch (activeSection) {
      case 'basic-info':
        return <BasicInfo userData={userData} onUpdate={setUserData} />
      case 'blogs':
        return <BlogManagement userData={userData} />
      case 'events':
        return <EventManagement userData={userData} />
      case 'gallery':
        return <GalleryManagement userData={userData} />
      case 'reviews':
        return <ReviewsTestimonials userData={userData} />
      case 'users':
        return checkUserPermission(userData.roles, PERMISSIONS.MANAGE_USERS) ?
          <UserManagement userData={userData} /> : null
      case 'announcements':
        return checkUserPermission(userData.roles, PERMISSIONS.MANAGE_ANNOUNCEMENTS) ?
          <AnnouncementManagement userData={userData} /> : null
      default:
        return <BasicInfo userData={userData} onUpdate={setUserData} />
    }
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <ProfileSidebar
              userData={userData}
              activeSection={activeSection}
              onSectionChange={setActiveSection}
              onRefresh={handleRefreshData}
            />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {renderActiveSection()}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage