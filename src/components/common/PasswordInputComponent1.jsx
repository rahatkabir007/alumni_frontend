"use client"
import React, { useState } from 'react'
import { Field, useFormikContext } from 'formik'

const PasswordInputComponent1 = ({
    name,
    label,
    placeholder = 'Enter password',
    value,
    onChange,
    onBlur,
    disabled = false,
    required = false,
    className = '',
    labelClassName = '',
    containerClassName = '',
    // Style customizations
    backgroundColor = 'bg-white/10',
    borderColor = 'border-gray-600',
    textColor = 'text-white',
    placeholderColor = 'placeholder-gray-400',
    focusBorderColor = 'focus:border-white/30',
    focusRingColor = 'focus:ring-white/20',
    iconColor = 'text-gray-400',
    iconHoverColor = 'hover:text-white',
    // Formik integration
    useFormik = false,
    showToggle = true,
    showValidationOnSubmit = false,
    hasSubmitted = false,
    ...props
}) => {
    const [showPassword, setShowPassword] = useState(false)
    const formik = useFormikContext?.() || null

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword)
    }

    const baseInputClasses = `
        w-full px-4 py-3 ${showToggle ? 'pr-12' : ''} border rounded-lg 
        focus:outline-none focus:ring-2 
        transition-all backdrop-blur-sm
        ${backgroundColor}
        ${borderColor}
        ${textColor}
        ${placeholderColor}
        ${focusBorderColor}
        ${focusRingColor}
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        ${className}
    `.trim()

    const labelClasses = `
        block text-sm font-medium mb-2
        ${labelClassName}
    `.trim()

    const containerClasses = `
        ${containerClassName}
    `.trim()

    const iconClasses = `
        absolute inset-y-0 right-0 pr-3 flex items-center 
        ${iconColor} ${iconHoverColor} transition-colors cursor-pointer
    `.trim()

    // Get field error from Formik if available and if form has been submitted
    const getFieldError = () => {
        if (useFormik && formik) {
            const touched = formik.touched[name]
            const error = formik.errors[name]
            const submitCount = formik.submitCount || 0

            // Only show validation errors after submit attempt
            return submitCount > 0 && error ? error : null
        }
        return null
    }

    const fieldError = getFieldError()

    // Check if field is empty for required validation
    const isEmpty = () => {
        if (useFormik && formik) {
            const fieldValue = formik.values[name]
            return !fieldValue || fieldValue.toString().trim() === ''
        }
        return !value || value.toString().trim() === ''
    }

    const shouldShowRequired = () => {
        if (!required) return false
        if (useFormik && formik) {
            const submitCount = formik.submitCount || 0
            return submitCount > 0 && isEmpty()
        }
        // For non-Formik forms, use hasSubmitted prop
        return hasSubmitted && isEmpty()
    }

    const EyeIcon = ({ show }) => (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {show ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
            ) : (
                <>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </>
            )}
        </svg>
    )

    if (useFormik) {
        return (
            <div className={containerClasses}>
                {label && (
                    <label htmlFor={name} className={labelClasses}>
                        {label}
                        {shouldShowRequired() && <sup className="text-red-400 ml-1">*required</sup>}
                        {fieldError && !shouldShowRequired() && <sup className="text-red-400 ml-1">*{fieldError}</sup>}
                    </label>
                )}
                <div className="relative">
                    <Field
                        id={name}
                        name={name}
                        type={showPassword ? "text" : "password"}
                        placeholder={placeholder}
                        disabled={disabled}
                        className={baseInputClasses}
                        {...props}
                    />
                    {showToggle && (
                        <button
                            type="button"
                            onClick={togglePasswordVisibility}
                            className={iconClasses}
                        >
                            <EyeIcon show={showPassword} />
                        </button>
                    )}
                </div>
            </div>
        )
    }

    return (
        <div className={containerClasses}>
            {label && (
                <label htmlFor={name} className={labelClasses}>
                    {label}
                    {shouldShowRequired() && <sup className="text-red-400 ml-1">*required</sup>}
                </label>
            )}
            <div className="relative">
                <input
                    id={name}
                    name={name}
                    type={showPassword ? "text" : "password"}
                    value={value}
                    onChange={onChange}
                    onBlur={onBlur}
                    placeholder={placeholder}
                    disabled={disabled}
                    className={baseInputClasses}
                    {...props}
                />
                {showToggle && (
                    <button
                        type="button"
                        onClick={togglePasswordVisibility}
                        className={iconClasses}
                    >
                        <EyeIcon show={showPassword} />
                    </button>
                )}
            </div>
        </div>
    )
}

export default PasswordInputComponent1

