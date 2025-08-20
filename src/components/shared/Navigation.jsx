"use client"
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSelector } from 'react-redux'
import { selectIsAuthenticated, selectCurrentUser } from '@/redux/features/auth/authSlice'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, Dropdown } from 'antd'
import { DownOutlined, UserOutlined, LogoutOutlined } from '@ant-design/icons'
import Link from 'next/link'
import Image from 'next/image'
import '@/styles/antd.css'

const Navigation = ({ user, onLogout, isInitialized, isLoggingOut }) => {
    const router = useRouter()
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const [mobileOpenSubmenu, setMobileOpenSubmenu] = useState(null)
    const [isMobile, setIsMobile] = useState(false)
    const [menuKey, setMenuKey] = useState(Date.now()) // Force re-render Menu on resize

    // Get auth state from Redux
    const isAuthenticated = useSelector(selectIsAuthenticated)
    const reduxUser = useSelector(selectCurrentUser)

    // Simplified loading logic
    const isLoading = !isInitialized || (isAuthenticated && !reduxUser && !user)

    // Use the most up-to-date user data available
    const currentUser = user || reduxUser

    // Menu structure with submenus
    const menuItems = [
        {
            key: 'home',
            label: <Link href="/">Home</Link>
        },
        {
            key: 'about',
            label: <Link href="/about">About</Link>
        },
        {
            key: 'alumni',
            label: (
                <span className="flex items-center gap-2">
                    Alumni
                    <svg
                        className="w-5 h-5 transition-transform"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </span>
            ),
            children: [
                {
                    key: 'students',
                    label: <Link href="/students">Students</Link>
                },
                {
                    key: 'teachers',
                    label: <Link href="/teachers">Teachers & Management</Link>
                },
            ]
        },
        {
            key: 'gallery',
            label: <Link href="/gallery">Gallery</Link>,
        },
        {
            key: 'blogs',
            label: (
                <span className="flex items-center gap-2">
                    Blogs & Events
                    <svg
                        className="w-5 h-5 transition-transform"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </span>
            ),
            children: [
                {
                    key: 'all-blogs',
                    label: <Link href="/blogs">Latest Blogs</Link>
                },
                {
                    key: 'events',
                    label: <Link href="/blogs/news">Latest Events</Link>
                },
            ]
        },
        {
            key: 'posts',
            label: <Link href="/posts">Posts</Link>,
        },
        {
            key: 'contact',
            label: <Link href="/contact">Contact</Link>
        }
    ]

    // User dropdown menu items
    const userMenuItems = [
        {
            key: 'profile',
            label: 'Profile',
            icon: <UserOutlined />,
            onClick: () => router.push('/profile')
        },
        {
            type: 'divider'
        },
        {
            key: 'logout',
            label: isLoggingOut ? 'Logging out...' : 'Logout',
            icon: <LogoutOutlined />,
            onClick: onLogout,
            disabled: isLoggingOut,
            danger: true
        }
    ]

    const handleMobileSubmenuToggle = (menuId) => {
        setMobileOpenSubmenu(mobileOpenSubmenu === menuId ? null : menuId)
    }

    const getMenuIcon = (menuId) => {
        const icons = {
            home: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />,
            about: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />,
            alumni: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />,
            gallery: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />,
            blogs: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />,
            events: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />,
            contact: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        }

        return (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {icons[menuId] || icons.home}
            </svg>
        )
    }

    const renderMobileMenuItem = (item) => {
        if (item.children) {
            return (
                <div key={item.key}>
                    <button
                        onClick={() => handleMobileSubmenuToggle(item.key)}
                        className="w-full flex items-center justify-between text-gray-300 hover:text-white hover:bg-gray-800 px-4 py-3 rounded-md text-base font-medium transition-colors"
                    >
                        <div className="flex items-center space-x-3">
                            {getMenuIcon(item.key)}
                            <span>{item.key === 'alumni' ? 'Alumni' : item.key === 'gallery' ? 'Gallery' : item.key === 'blogs' ? 'Blogs' : item.key === 'events' ? 'Events' : item.label}</span>
                        </div>
                        <svg
                            className={`w-5 h-5 transition-transform ${mobileOpenSubmenu === item.key ? 'rotate-180' : ''}`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>

                    {mobileOpenSubmenu === item.key && (
                        <div className="ml-4 mt-1 space-y-1 border-l border-gray-700 pl-4">
                            {item.children.map((subItem) => (
                                <div
                                    key={subItem.key}
                                    onClick={() => {
                                        setIsMobileMenuOpen(false)
                                        setMobileOpenSubmenu(null)
                                    }}
                                    className="block text-gray-400 hover:text-white hover:bg-gray-800 px-3 py-2 rounded-md text-sm transition-colors cursor-pointer"
                                >
                                    {subItem.label}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )
        }

        return (
            <div
                key={item.key}
                onClick={() => {
                    setIsMobileMenuOpen(false)
                    setMobileOpenSubmenu(null)
                }}
                className="block text-gray-300 hover:text-white hover:bg-gray-800 px-4 py-3 rounded-md text-base font-medium transition-colors cursor-pointer"
            >
                <div className="flex items-center space-x-3">
                    {getMenuIcon(item.key)}
                    <span>{item.label}</span>
                </div>
            </div>
        )
    }

    // Track window resize and force menu re-render
    useEffect(() => {
        const handleResize = () => {
            const mobile = window.innerWidth < 1124
            setIsMobile(mobile)
            console.log('Resize: isMobile=', mobile, 'isMobileMenuOpen=', isMobileMenuOpen)

            // Reset mobile menu states and force menu re-render on desktop
            if (!mobile) {
                setIsMobileMenuOpen(false)
                setMobileOpenSubmenu(null)
                setMenuKey(Date.now()) // Force re-render of Menu component
            }
        }

        // Set initial state
        handleResize()

        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    return (
        <nav className="sticky top-0 z-50 bg-black shadow-xl border-b border-gray-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    {/* Logo */}
                    <div className="flex items-center">
                        <Link href="/" className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-emerald-500 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg">
                                CIHS
                            </div>
                            <div>
                                <div className="text-lg font-bold text-white">CIHS Alumni</div>
                                <div className="text-xs text-gray-400">Chittagong Ideal High School</div>
                            </div>
                        </Link>
                    </div>

                    {/* Desktop Navigation Links */}
                    <div className="hidden lg:flex items-center space-x-2">
                        <Menu
                            key={menuKey} // Force re-render on resize
                            mode="horizontal"
                            items={menuItems}
                            className="navigation-menu bg-transparent border-none"
                            style={{
                                backgroundColor: 'transparent',
                                borderBottom: 'none',
                                lineHeight: '64px',
                                display: isMobile ? 'none' : 'flex', // Explicitly control visibility
                            }}
                            theme="dark"
                        />

                        {/* Desktop Auth Section */}
                        <div className="ml-4">
                            {isLoading ? (
                                <div className="flex items-center space-x-2 px-3 py-2">
                                    <div className="animate-pulse bg-gray-700 w-8 h-8 rounded-full"></div>
                                    <div className="animate-pulse bg-gray-700 h-4 w-20 rounded"></div>
                                    <div className="animate-pulse bg-gray-700 w-4 h-4 rounded"></div>
                                </div>
                            ) : isAuthenticated && currentUser ? (
                                <Dropdown
                                    menu={{ items: userMenuItems }}
                                    trigger={['click']}
                                    placement="bottomRight"
                                >
                                    <button className="flex items-center space-x-2 text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">
                                        <div className="flex items-center justify-center text-white text-2xl font-bold overflow-hidden relative flex-col">
                                            {currentUser.profilePhoto ? (
                                                <Image
                                                    src={currentUser.profilePhoto}
                                                    alt="Profile"
                                                    className="w-8 h-8 object-cover rounded-full"
                                                    width={96}
                                                    height={96}
                                                />
                                            ) : (
                                                <div className="w-8 h-8 rounded-full flex items-center justify-center bg-gradient-to-br from-blue-500 to-emerald-500 text-white text-sm font-bold">
                                                    {currentUser.name?.charAt(0).toUpperCase() || 'A'}
                                                </div>
                                            )}
                                        </div>
                                        <span className="truncate">{currentUser.name || 'Alumni'}</span>
                                        <svg
                                            className="w-5 h-5 transition-transform"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>
                                </Dropdown>
                            ) : (
                                <div className="flex items-center space-x-2">
                                    <button
                                        onClick={() => router.push('/login')}
                                        className="text-white px-4 py-2 rounded-md text-sm font-medium border border-white hover:bg-white hover:text-black transition-colors"
                                    >
                                        Login
                                    </button>
                                    <button
                                        onClick={() => router.push('/register')}
                                        className="bg-white text-black hover:bg-gray-200 px-4 py-2 rounded-md text-sm font-medium transition-colors shadow-lg"
                                    >
                                        Join Alumni
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Mobile menu button */}
                    <div className="flex items-center lg:hidden">
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="text-gray-300 hover:text-white focus:outline-none focus:text-white"
                        >
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                {isMobileMenuOpen ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                )}
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isMobileMenuOpen && isMobile && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-[rgba(0,0,0,0.6)] bg-opacity-50 z-40 lg:hidden"
                            onClick={() => setIsMobileMenuOpen(false)}
                        />

                        {/* Sliding Menu */}
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'tween', duration: 0.3 }}
                            className="fixed top-0 right-0 h-full w-80 bg-gray-900 shadow-xl z-50 lg:hidden overflow-y-auto"
                        >
                            {/* Menu Header */}
                            <div className="flex justify-between items-center p-4 border-b border-gray-800">
                                <div className="flex items-center space-x-3">
                                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-emerald-500 rounded-full flex items-center justify-center text-white font-bold text-xs">
                                        CIHS
                                    </div>
                                    <div>
                                        <div className="text-sm font-bold text-white">CIHS Alumni</div>
                                        <div className="text-xs text-gray-400">Menu</div>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="text-gray-300 hover:text-white p-1"
                                >
                                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            {/* Menu Content */}
                            <div className="p-4">
                                {/* User Section */}
                                {isLoading ? (
                                    <div className="mb-6 p-4 bg-gray-800 rounded-lg">
                                        <div className="animate-pulse bg-gray-700 h-8 w-24 rounded mb-2"></div>
                                        <div className="animate-pulse bg-gray-700 h-4 w-32 rounded"></div>
                                    </div>
                                ) : isAuthenticated && currentUser ? (
                                    <div className="mb-6 p-4 bg-gray-800 rounded-lg">
                                        <div className="flex items-center space-x-3 mb-3">
                                            <div className="flex items-center justify-center text-white text-2xl font-bold overflow-hidden relative flex-col">
                                                {currentUser.profilePhoto ? (
                                                    <Image
                                                        src={currentUser.profilePhoto}
                                                        alt="Profile"
                                                        className="w-12 h-12 object-cover rounded-full"
                                                        width={96}
                                                        height={96}
                                                    />
                                                ) : (
                                                    <div className="w-12 h-12 rounded-full flex items-center justify-center bg-gradient-to-br from-blue-500 to-emerald-500 text-white text-lg font-bold">
                                                        {currentUser.name?.charAt(0).toUpperCase() || 'A'}
                                                    </div>
                                                )}
                                            </div>
                                            <div>
                                                <div className="text-white font-medium text-lg truncate">{currentUser.name || 'Alumni'}</div>
                                                <div className="text-gray-400 text-sm">{currentUser.email}</div>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <button
                                                onClick={() => {
                                                    router.push('/profile')
                                                    setIsMobileMenuOpen(false)
                                                }}
                                                className="w-full text-left bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-md text-sm transition-colors"
                                            >
                                                View Profile
                                            </button>
                                            <button
                                                onClick={() => {
                                                    onLogout()
                                                    setIsMobileMenuOpen(false)
                                                }}
                                                disabled={isLoggingOut}
                                                className="w-full text-left bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-md text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                {isLoggingOut ? 'Logging out...' : 'Logout'}
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="mb-6 p-4 bg-gray-800 rounded-lg space-y-3">
                                        <div className="text-white font-medium mb-2">Join Our Alumni Network</div>
                                        <button
                                            onClick={() => {
                                                router.push('/login')
                                                setIsMobileMenuOpen(false)
                                            }}
                                            className="w-full text-white py-2 px-4 rounded-md text-sm font-medium border border-white hover:bg-white hover:text-black transition-colors"
                                        >
                                            Login
                                        </button>
                                        <button
                                            onClick={() => {
                                                router.push('/register')
                                                setIsMobileMenuOpen(false)
                                            }}
                                            className="w-full bg-white text-black hover:bg-gray-200 py-2 px-4 rounded-md text-sm font-medium transition-colors"
                                        >
                                            Join Alumni
                                        </button>
                                    </div>
                                )}

                                {/* Navigation Links */}
                                <div className="space-y-1">
                                    <div className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-3 px-2">Navigation</div>
                                    {menuItems.map(renderMobileMenuItem)}
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </nav>
    )
}

export default Navigation