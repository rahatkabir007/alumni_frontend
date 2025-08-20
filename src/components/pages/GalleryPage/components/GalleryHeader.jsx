"use client"
import React from 'react'
import { useRouter } from 'next/navigation'
import ScrollReveal from '@/components/animations/ScrollReveal'
import BlackButton from '@/components/common/BlackButton'
import IntroSection from '@/components/common/IntroSection'
import { useDispatch } from 'react-redux'
import { setActiveSection } from '@/redux/features/profile/profileSlice'

const GalleryHeader = () => {
    const router = useRouter()
    const dispatch = useDispatch()

    return (
        <>
            {/* Header */}
            <IntroSection
                tag='Gallery'
                title='Memory Lane'
                description='Explore the rich history and vibrant memories of CIHS through our alumni gallery. From events to daily life, relive the moments that shaped our community.'
            />

            {/* Upload CTA */}
            <ScrollReveal direction="up" delay={0.3}>
                <section className="py-8 bg-white border-b">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex flex-col md:flex-row items-center justify-between">
                            <div>
                                <h2 className="text-xl font-bold text-gray-900 mb-2">Share Your Memories</h2>
                                <p className="text-gray-600">Have photos from your CIHS days? Login and share them with the community!</p>
                            </div>
                            <BlackButton
                                onClick={() => {
                                    router.push('/profile')
                                    dispatch(setActiveSection("gallery"))
                                }}
                                icon={
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                    </svg>
                                }
                            >
                                Upload Photos
                            </BlackButton>
                        </div>
                    </div>
                </section>
            </ScrollReveal>
        </>
    )
}

export default GalleryHeader
