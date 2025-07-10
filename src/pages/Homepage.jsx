"use client"
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Login from '@/components/SocialLogin'

const Homepage = () => {
    const router = useRouter()
    const [isChecking, setIsChecking] = useState(true)

    useEffect(() => {
        // Check if user is already logged in
        const token = localStorage.getItem('token')
        const userData = localStorage.getItem('user')

        if (token && userData) {
            try {
                // Verify that user data is valid
                JSON.parse(userData)
                // Redirect to dashboard if already logged in
                router.push('/dashboard')
                return
            } catch (error) {
                // Invalid user data, clear storage
                localStorage.removeItem('token')
                localStorage.removeItem('user')
            }
        }

        setIsChecking(false)
    }, [router])

    // Show loading while checking authentication
    if (isChecking) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        )
    }

    return (
        <div><Login /></div>
    )
}

export default Homepage