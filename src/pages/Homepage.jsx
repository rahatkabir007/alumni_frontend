"use client"
import React from 'react'
import { useRouter } from 'next/navigation'
import { useSelector } from 'react-redux'
import { selectIsAuthenticated } from '@/redux/features/auth/authSlice'

const Homepage = () => {
    const router = useRouter()
    const isAuthenticated = useSelector(selectIsAuthenticated)

    return (
        <div className="bg-gray-50">
            {/* Hero Section */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center py-16 sm:py-20">
                    <h1 className="text-4xl sm:text-6xl font-bold text-gray-900 mb-6">
                        Welcome to Alumni Network
                    </h1>
                    <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                        Connect with fellow alumni, share experiences, and build lasting professional relationships.
                        Join our growing community of graduates making a difference.
                    </p>

                    {!isAuthenticated ? (
                        <div className="space-x-4">
                            <button
                                onClick={() => router.push('/login')}
                                className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors"
                            >
                                Get Started
                            </button>
                            <button
                                onClick={() => router.push('/register')}
                                className="border border-blue-600 text-blue-600 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-50 transition-colors"
                            >
                                Sign Up
                            </button>
                        </div>
                    ) : (
                        <div className="space-x-4">
                            <button
                                onClick={() => router.push('/dashboard')}
                                className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors"
                            >
                                Go to Dashboard
                            </button>
                        </div>
                    )}
                </div>

                {/* Features Section */}
                <div className="py-16">
                    <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
                        Why Join Our Alumni Network?
                    </h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="text-center p-6">
                            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-2xl">🤝</span>
                            </div>
                            <h3 className="text-xl font-semibold mb-2">Network</h3>
                            <p className="text-gray-600">Connect with alumni from your institution and build meaningful professional relationships.</p>
                        </div>
                        <div className="text-center p-6">
                            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-2xl">💼</span>
                            </div>
                            <h3 className="text-xl font-semibold mb-2">Opportunities</h3>
                            <p className="text-gray-600">Discover job opportunities, mentorship programs, and career advancement resources.</p>
                        </div>
                        <div className="text-center p-6">
                            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-2xl">🎓</span>
                            </div>
                            <h3 className="text-xl font-semibold mb-2">Growth</h3>
                            <p className="text-gray-600">Access exclusive events, workshops, and continuous learning opportunities.</p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}

export default Homepage