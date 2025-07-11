"use client"
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { useEffect, useState } from 'react'

const ScrollReveal = ({
    children,
    direction = 'up',
    delay = 0,
    duration = 0.6,
    distance = 50,
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

    const directionVariants = {
        up: {
            hidden: { opacity: 0, y: distance },
            visible: { opacity: 1, y: 0 }
        },
        down: {
            hidden: { opacity: 0, y: -distance },
            visible: { opacity: 1, y: 0 }
        },
        left: {
            hidden: { opacity: 0, x: -distance },
            visible: { opacity: 1, x: 0 }
        },
        right: {
            hidden: { opacity: 0, x: distance },
            visible: { opacity: 1, x: 0 }
        },
        scale: {
            hidden: { opacity: 0, scale: 0.8 },
            visible: { opacity: 1, scale: 1 }
        },
        fade: {
            hidden: { opacity: 0 },
            visible: { opacity: 1 }
        }
    }

    // Don't animate on server-side to prevent hydration mismatch
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
            variants={directionVariants[direction]}
            transition={{
                duration,
                delay,
                ease: [0.25, 0.46, 0.45, 0.94]
            }}
            className={className}
        >
            {children}
        </motion.div>
    )
}

export default ScrollReveal
