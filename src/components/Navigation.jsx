"use client"
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const Navigation = ({ user, onLogout, isInitialized }) => {
    const router = useRouter()
    const [isDropdownOpen, setIsDropdownOpen] = useState(false)

    return (
        <nav className="bg-slate-900 shadow-xl border-b border-slate-700">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    {/* Logo */}
                    <div className="flex items-center">
                        <Link href="/" className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-emerald-500 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg">
                                CIHS
                            </div>
                            <div>
                                <div className="text-lg font-bold text-blue-400">CIHS Alumni</div>
                                <div className="text-xs text-slate-400">Chittagong Ideal High School</div>
                            </div>
                        </Link>
                    </div>

                    {/* Navigation Links */}
                    <div className="flex items-center space-x-6">
                        <Link href="/" className="text-slate-300 hover:text-blue-400 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                            Home
                        </Link>
                        <Link href="/about" className="text-slate-300 hover:text-blue-400 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                            About School
                        </Link>
                        <Link href="/students" className="text-slate-300 hover:text-blue-400 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                            Alumni
                        </Link>
                        <Link href="/teachers" className="text-slate-300 hover:text-blue-400 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                            Teachers
                        </Link>
                        <Link href="/blogs" className="text-slate-300 hover:text-blue-400 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                            Blogs
                        </Link>
                        <Link href="/events" className="text-slate-300 hover:text-blue-400 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                            Events
                        </Link>
                        <Link href="/contact" className="text-slate-300 hover:text-blue-400 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                            Contact
                        </Link>

                        {/* Conditional Authentication */}
                        {!isInitialized ? (
                            <div className="flex items-center space-x-2 px-3 py-2">
                                <div className="animate-pulse bg-slate-700 w-8 h-8 rounded-full"></div>
                                <div className="animate-pulse bg-slate-700 h-4 w-20 rounded"></div>
                                <div className="animate-pulse bg-slate-700 w-4 h-4 rounded"></div>
                            </div>
                        ) : !user ? (
                            <div className="flex items-center space-x-2">
                                <button
                                    onClick={() => router.push('/login')}
                                    className="text-blue-400 hover:text-blue-300 px-4 py-2 rounded-md text-sm font-medium border border-blue-500 hover:bg-blue-500/10 transition-colors"
                                >
                                    Login
                                </button>
                                <button
                                    onClick={() => router.push('/register')}
                                    className="bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-md text-sm font-medium transition-colors shadow-lg"
                                >
                                    Join Alumni
                                </button>
                            </div>
                        ) : (
                            <div className="relative">
                                <button
                                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                    className="flex items-center space-x-2 text-slate-300 hover:text-blue-400 px-3 py-2 rounded-md text-sm font-medium"
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
                                    <div className="absolute right-0 mt-2 w-48 bg-slate-800 rounded-md shadow-xl border border-slate-700 py-1 z-50">
                                        <button
                                            onClick={() => {
                                                router.push('/dashboard')
                                                setIsDropdownOpen(false)
                                            }}
                                            className="block w-full text-left px-4 py-2 text-sm text-slate-300 hover:bg-slate-700 hover:text-blue-400"
                                        >
                                            Dashboard
                                        </button>
                                        <button
                                            onClick={() => {
                                                router.push('/profile')
                                                setIsDropdownOpen(false)
                                            }}
                                            className="block w-full text-left px-4 py-2 text-sm text-slate-300 hover:bg-slate-700 hover:text-blue-400"
                                        >
                                            My Profile
                                        </button>
                                        <hr className="my-1 border-slate-700" />
                                        <button
                                            onClick={() => {
                                                onLogout()
                                                setIsDropdownOpen(false)
                                            }}
                                            className="block w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-slate-700"
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
