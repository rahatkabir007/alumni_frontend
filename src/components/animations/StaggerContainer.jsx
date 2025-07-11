"use client"
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { useEffect, useState } from 'react'

const StaggerContainer = ({
    children,
    staggerDelay = 0.1,
    className = '',
    once = true,
    threshold = 0.1
}) => {
    const [isMounted, setIsMounted] = useState(false)
    const { ref, inView } = useInView({
        threshold,
        triggerOnce: once,
        rootMargin: '-10% 0px -10% 0px'
    })

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
            animate={inView ? "visible" : "hidden"}
            variants={container}
            className={className}
        >
            {children}
        </motion.div>
    )
}

export default StaggerContainer
