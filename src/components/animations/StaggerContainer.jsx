"use client"
import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef, useEffect, useState } from 'react'

const StaggerContainer = ({
    children,
    staggerDelay = 0.1,
    className = '',
    once = true
}) => {
    const ref = useRef(null)
    const [isMounted, setIsMounted] = useState(false)
    const isInView = useInView(ref, { once, margin: '-10% 0px -10% 0px' })

    useEffect(() => {
        setIsMounted(true)
    }, [])

    const container = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: staggerDelay,
                delayChildren: 0.1
            }
        }
    }

    // Don't animate on server-side
    if (!isMounted) {
        return (
            <div ref={ref} className={className}>
                {children}
            </div>
        )
    }

    return (
        <motion.div
            ref={ref}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            variants={container}
            className={className}
        >
            {children}
        </motion.div>
    )
}

export default StaggerContainer
