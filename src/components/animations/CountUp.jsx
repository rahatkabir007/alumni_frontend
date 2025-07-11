"use client"
import { motion, useMotionValue, useTransform, animate } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'

const CountUp = ({
    from = 0,
    to,
    duration = 2,
    suffix = '',
    className = ''
}) => {
    const ref = useRef(null)
    const [isMounted, setIsMounted] = useState(false)
    const count = useMotionValue(from)
    const rounded = useTransform(count, latest => Math.round(latest))
    const isInView = useInView(ref, { once: true })

    useEffect(() => {
        setIsMounted(true)
    }, [])

    useEffect(() => {
        if (isMounted && isInView) {
            const controls = animate(count, to, {
                duration,
                ease: "easeOut"
            })
            return controls.stop
        }
    }, [isInView, count, to, duration, isMounted])

    // Show final value on server-side to prevent hydration mismatch
    if (!isMounted) {
        return (
            <div ref={ref} className={className}>
                {to}{suffix}
            </div>
        )
    }

    return (
        <motion.div ref={ref} className={className}>
            <motion.span>{rounded}</motion.span>
            {suffix}
        </motion.div>
    )
}

export default CountUp
