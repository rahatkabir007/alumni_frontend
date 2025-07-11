"use client"
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

const FloatingElements = ({ count = 5, className = '' }) => {
    const [isMounted, setIsMounted] = useState(false)

    useEffect(() => {
        setIsMounted(true)
    }, [])

    const floatingVariants = {
        animate: {
            y: [-20, 20, -20],
            x: [-10, 10, -10],
            rotate: [0, 180, 360],
            transition: {
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut"
            }
        }
    }

    // Don't render on server-side to prevent hydration mismatch
    if (!isMounted) {
        return null
    }

    const elements = Array.from({ length: count }, (_, i) => (
        <motion.div
            key={i}
            variants={floatingVariants}
            animate="animate"
            className="absolute opacity-20"
            style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${i * 0.5}s`
            }}
        >
            <div className="w-4 h-4 bg-blue-400 rounded-full"></div>
        </motion.div>
    ))

    return (
        <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
            {elements}
        </div>
    )
}

export default FloatingElements
