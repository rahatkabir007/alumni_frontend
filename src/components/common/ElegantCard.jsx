"use client"
import React from 'react'
import { motion } from 'framer-motion'

const ElegantCard = ({
    children,
    className = '',
    hover = true,
    padding = 'md',
    shadow = 'md',
    border = true,
    background = 'white',
    initial = { opacity: 0, y: 20 },
}) => {
    const paddingClasses = {
        sm: 'p-4',
        md: 'p-6',
        lg: 'p-8'
    }

    const shadowClasses = {
        none: '',
        sm: 'shadow-sm',
        md: 'shadow-md',
        lg: 'shadow-lg',
        xl: 'shadow-xl'
    }

    const backgroundClasses = {
        white: 'bg-white',
        gray: 'bg-gray-50',
        black: 'bg-black text-white'
    }

    const baseClasses = `
        ${backgroundClasses[background]}
        ${paddingClasses[padding]}
        ${shadowClasses[shadow]}
        ${border ? 'border border-gray-200' : ''}
        rounded-xl
        transition-all duration-300
        ${hover ? 'hover:shadow-xl hover:-translate-y-2' : ''}
        ${className}
    `.trim()

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className={baseClasses}
        >
            {children}
        </motion.div>
    )
}

export default ElegantCard
