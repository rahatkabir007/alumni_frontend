"use client"
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Navigation from '@/components/Navigation'

const Homepage = () => {
    const router = useRouter()
    const [user, setUser] = useState(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        // Check if user is already logged in
        const token = localStorage.getItem('token')
        const userData = localStorage.getItem('user')

        if (token && userData) {
            try {
                // Verify that user data is valid
                const parsedUser = JSON.parse(userData)
                setUser(parsedUser)
            } catch (error) {
                // Invalid user data, clear storage
                localStorage.removeItem('token')
                localStorage.removeItem('user')
                setUser(null)
            }
        }

        setIsLoading(false)
    }, [])

    const handleLogout = () => {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        setUser(null)
        router.push('/')
    }

    // Show loading while checking authentication
    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Navigation user={user} onLogout={handleLogout} />

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

                    {!user ? (
                        <div className="space-x-4">
                            <button
                                onClick={() => router.push('/login')}
                                className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors"
                            >
                                Get Started
                            </button>
                            <button
                                onClick={() => router.push('/signup')}
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