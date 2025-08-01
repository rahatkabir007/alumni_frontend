"use client"
import React from 'react'
import { motion } from 'framer-motion'

const BlackButton = ({
    children,
    onClick,
    variant = 'filled',
    size = 'md',
    disabled = false,
    className = '',
    icon = null,
    loading = false,
    ...props
}) => {
    const baseClasses = "font-semibold rounded-lg transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"

    const sizeClasses = {
        sm: "px-4 py-2 text-sm",
        md: "px-6 py-3 text-base",
        lg: "px-8 py-4 text-lg"
    }

    const variantClasses = {
        filled: "bg-black text-white hover:bg-gray-800 hover:shadow-lg",
        outline: "bg-transparent text-black border-2 border-black hover:bg-black hover:text-white",
        ghost: "bg-transparent text-black hover:bg-black hover:text-white"
    }

    const disabledClasses = "opacity-50 cursor-not-allowed"

    // If className contains custom styling, use it, otherwise use variant classes
    const hasCustomStyling = className.includes('bg-') || className.includes('text-')

    const buttonClasses = `
        ${baseClasses} 
        ${sizeClasses[size]} 
        ${hasCustomStyling ? '' : variantClasses[variant]} 
        ${disabled ? disabledClasses : 'hover:-translate-y-1'} 
        ${className}
    `.trim()

    return (
        <motion.button
            whileHover={!disabled ? { scale: 1.02 } : {}}
            whileTap={!disabled ? { scale: 0.98 } : {}}
            className={buttonClasses}
            onClick={onClick}
            disabled={disabled || loading}
            {...props}
        >
            {loading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current" />
            ) : (
                <>
                    {icon && <span>{icon}</span>}
                    {children}
                </>
            )}
        </motion.button>
    )
}

export default BlackButton
