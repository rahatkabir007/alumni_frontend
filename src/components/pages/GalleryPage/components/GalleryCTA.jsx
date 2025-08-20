"use client"
import React from 'react'
import { useRouter } from 'next/navigation'
import ScrollReveal from '@/components/animations/ScrollReveal'
import BlackButton from '@/components/common/BlackButton'
import { useDispatch } from 'react-redux'
import { setActiveSection } from '@/redux/features/profile/profileSlice'

const GalleryCTA = () => {
    const router = useRouter()
    const dispatch = useDispatch()

    return (
        <ScrollReveal direction="up" delay={0.6}>
            <section className="py-16 bg-black text-white">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl font-bold mb-4">
                        Have More Memories to Share?
                    </h2>
                    <p className="text-lg text-gray-300 mb-8">
                        Help us build a comprehensive archive of CIHS memories. Your photos and stories matter to our community.
                    </p>
                    <div className='flex justify-center items-center'>
                        <BlackButton
                            onClick={() => {
                                router.push('/profile')
                                dispatch(setActiveSection("gallery"))
                            }}
                            size="lg"
                            className="bg-white text-black hover:bg-gray-200"
                        >
                            Upload Your Photos
                        </BlackButton>
                    </div>
                </div>
            </section>
        </ScrollReveal>
    )
}

export default GalleryCTA
