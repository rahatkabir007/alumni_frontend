"use client"
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const Navigation = ({ user, onLogout, isInitialized }) => {
    const router = useRouter()
    const [isDropdownOpen, setIsDropdownOpen] = useState(false)

    return (
        <nav className="bg-white shadow-lg">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    {/* Logo */}
                    <div className="flex items-center">
                        <Link href="/" className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-green-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                                CIHS
                            </div>
                            <div>
                                <div className="text-lg font-bold text-blue-600">CIHS Alumni</div>
                                <div className="text-xs text-gray-500">Chittagong Ideal High School</div>
                            </div>
                        </Link>
                    </div>

                    {/* Navigation Links */}
                    <div className="flex items-center space-x-6">
                        <Link href="/" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                            Home
                        </Link>
                        <Link href="/about" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                            About School
                        </Link>
                        <Link href="/students" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                            Alumni
                        </Link>
                        <Link href="/teachers" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                            Teachers
                        </Link>
                        <Link href="/blogs" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                            Blogs
                        </Link>
                        <Link href="/events" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                            Events
                        </Link>
                        <Link href="/contact" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                            Contact
                        </Link>

                        {/* Conditional Authentication */}
                        {!isInitialized ? (
                            <div className="flex items-center space-x-2 px-3 py-2">
                                <div className="animate-pulse bg-gray-200 w-8 h-8 rounded-full"></div>
                                <div className="animate-pulse bg-gray-200 h-4 w-20 rounded"></div>
                                <div className="animate-pulse bg-gray-200 w-4 h-4 rounded"></div>
                            </div>
                        ) : !user ? (
                            <div className="flex items-center space-x-2">
                                <button
                                    onClick={() => router.push('/login')}
                                    className="text-blue-600 hover:text-blue-700 px-4 py-2 rounded-md text-sm font-medium border border-blue-600 hover:bg-blue-50 transition-colors"
                                >
                                    Login
                                </button>
                                <button
                                    onClick={() => router.push('/register')}
                                    className="bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-md text-sm font-medium transition-colors"
                                >
                                    Join Alumni
                                </button>
                            </div>
                        ) : (
                            <div className="relative">
                                <button
                                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                    className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
                                >
                                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                                        {user.name?.charAt(0).toUpperCase() || 'A'}
                                    </div>
                                    <span>{user.name || 'Alumni'}</span>
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>

                                {/* Dropdown Menu */}
                                {isDropdownOpen && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                                        <button
                                            onClick={() => {
                                                router.push('/dashboard')
                                                setIsDropdownOpen(false)
                                            }}
                                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        >
                                            Dashboard
                                        </button>
                                        <button
                                            onClick={() => {
                                                router.push('/profile')
                                                setIsDropdownOpen(false)
                                            }}
                                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        >
                                            My Profile
                                        </button>
                                        <hr className="my-1" />
                                        <button
                                            onClick={() => {
                                                onLogout()
                                                setIsDropdownOpen(false)
                                            }}
                                            className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                                        >
                                            Logout
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    )
}

export default Navigation
