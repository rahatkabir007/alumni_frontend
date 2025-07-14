"use client"
import React, { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'

const Navigation = ({ user, onLogout, isInitialized }) => {
    const router = useRouter()
    const [isDropdownOpen, setIsDropdownOpen] = useState(false)
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const dropdownRef = useRef(null)

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false)
            }
        }

        if (isDropdownOpen) {
            document.addEventListener('mousedown', handleClickOutside)
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [isDropdownOpen])

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
                    <div className="hidden md:flex items-center space-x-6">
                        <Link href="/" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">
                            Home
                        </Link>
                        <Link href="/about" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">
                            About School
                        </Link>
                        <Link href="/students" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">
                            Alumni
                        </Link>
                        <Link href="/teachers" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">
                            Teachers
                        </Link>
                        <Link href="/gallery" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">
                            Gallery
                        </Link>
                        <Link href="/blogs" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">
                            Blogs
                        </Link>
                        <Link href="/events" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">
                            Events
                        </Link>
                        <Link href="/contact" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">
                            Contact
                        </Link>

                        {/* Desktop Auth Section */}
                        {!isInitialized ? (
                            <div className="flex items-center space-x-2 px-3 py-2">
                                <div className="animate-pulse bg-gray-700 w-8 h-8 rounded-full"></div>
                                <div className="animate-pulse bg-gray-700 h-4 w-20 rounded"></div>
                                <div className="animate-pulse bg-gray-700 w-4 h-4 rounded"></div>
                            </div>
                        ) : !user ? (
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
                        ) : (
                            <div className="relative" ref={dropdownRef}>
                                <button
                                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                    className="flex items-center space-x-2 text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                                >
                                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-emerald-500 rounded-full flex items-center justify-center text-white text-sm font-semibold shadow-lg">
                                        {user.name?.charAt(0).toUpperCase() || 'A'}
                                    </div>
                                    <span>{user.name || 'Alumni'}</span>
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>

                                {/* Dropdown Menu */}
                                {isDropdownOpen && (
                                    <div className="absolute right-0 mt-2 w-48 bg-gray-900 rounded-md shadow-xl border border-gray-700 py-1 z-50">
                                        <button
                                            onClick={() => {
                                                router.push('/profile')
                                                setIsDropdownOpen(false)
                                            }}
                                            className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white"
                                        >
                                            Profile
                                        </button>
                                        <hr className="my-1 border-gray-700" />
                                        <button
                                            onClick={() => {
                                                onLogout()
                                                setIsDropdownOpen(false)
                                            }}
                                            className="block w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-gray-800"
                                        >
                                            Logout
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden flex items-center">
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

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-gray-900 border-t border-gray-800"
                    >
                        <div className="px-2 pt-2 pb-3 space-y-1">
                            <Link
                                href="/"
                                className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                Home
                            </Link>
                            <Link
                                href="/about"
                                className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                About School
                            </Link>
                            <Link
                                href="/students"
                                className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                Alumni
                            </Link>
                            <Link
                                href="/teachers"
                                className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                Teachers
                            </Link>
                            <Link
                                href="/blogs"
                                className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                Blogs
                            </Link>
                            <Link
                                href="/events"
                                className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                Events
                            </Link>
                            <Link
                                href="/contact"
                                className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                Contact
                            </Link>

                            {/* Mobile Auth Section */}
                            <div className="border-t border-gray-700 pt-4">
                                {!isInitialized ? (
                                    <div className="px-3 py-2">
                                        <div className="animate-pulse bg-gray-700 h-8 w-24 rounded mb-2"></div>
                                        <div className="animate-pulse bg-gray-700 h-4 w-32 rounded"></div>
                                    </div>
                                ) : !user ? (
                                    <div className="space-y-2 px-3">
                                        <button
                                            onClick={() => {
                                                router.push('/login')
                                                setIsMobileMenuOpen(false)
                                            }}
                                            className="w-full text-left text-white py-2 text-base font-medium border border-white rounded-md px-4 hover:bg-white hover:text-black transition-colors"
                                        >
                                            Login
                                        </button>
                                        <button
                                            onClick={() => {
                                                router.push('/register')
                                                setIsMobileMenuOpen(false)
                                            }}
                                            className="w-full text-left bg-white text-black hover:bg-gray-200 py-2 text-base font-medium rounded-md px-4 transition-colors"
                                        >
                                            Join Alumni
                                        </button>
                                    </div>
                                ) : (
                                    <div className="px-3">
                                        <div className="flex items-center space-x-3 py-2 mb-2">
                                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-emerald-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                                                {user.name?.charAt(0).toUpperCase() || 'A'}
                                            </div>
                                            <span className="text-white font-medium">{user.name || 'Alumni'}</span>
                                        </div>
                                        <button
                                            onClick={() => {
                                                router.push('/profile')
                                                setIsMobileMenuOpen(false)
                                            }}
                                            className="block w-full text-left text-gray-300 hover:text-white py-2 text-base"
                                        >
                                            Profile
                                        </button>
                                        <button
                                            onClick={() => {
                                                onLogout()
                                                setIsMobileMenuOpen(false)
                                            }}
                                            className="block w-full text-left text-red-400 hover:text-red-300 py-2 text-base"
                                        >
                                            Logout
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    )
}

export default Navigation
