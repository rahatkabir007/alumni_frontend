"use client"
import React from 'react'

const BlackTag = ({
    children,
    size = 'sm',
    variant = 'filled',
    className = ''
}) => {
    const sizeClasses = {
        xs: 'px-2 py-1 text-xs',
        sm: 'px-3 py-1 text-sm',
        md: 'px-4 py-2 text-base'
    }

    const variantClasses = {
        filled: 'bg-black text-white',
        outline: 'bg-transparent text-black border border-black',
        subtle: 'bg-gray-100 text-black'
    }

    const baseClasses = `
        inline-flex items-center
        font-medium
        rounded-full
        transition-all duration-200
        ${sizeClasses[size]}
        ${variantClasses[variant]}
        ${className}
    `.trim()

    return (
        <span className={baseClasses}>
            {children}
        </span>
    )
}

export default BlackTag
