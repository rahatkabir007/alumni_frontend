"use client"
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

const AnimatedCard = ({
    children,
    className = '',
    hoverScale = 1.05,
    tapScale = 0.95,
    rotateOnHover = false
}) => {
    const [isMounted, setIsMounted] = useState(false)

    useEffect(() => {
        setIsMounted(true)
    }, [])

    const cardVariants = {
        hidden: {
            opacity: 0,
            y: 50,
            rotateX: rotateOnHover ? -10 : 0
        },
        visible: {
            opacity: 1,
            y: 0,
            rotateX: 0,
            transition: {
                duration: 0.5,
                ease: "easeOut"
            }
        }
    }

    // Don't animate on server-side
    if (!isMounted) {
        return (
            <div className={className}>
                {children}
            </div>
        )
    }

    return (
        <motion.div
            variants={cardVariants}
            whileHover={{
                scale: hoverScale,
                rotateY: rotateOnHover ? 5 : 0,
                transition: { duration: 0.3 }
            }}
            whileTap={{ scale: tapScale }}
            className={`cursor-pointer ${className}`}
            style={{ transformStyle: 'preserve-3d' }}
        >
            {children}
        </motion.div>
    )
}

export default AnimatedCard
