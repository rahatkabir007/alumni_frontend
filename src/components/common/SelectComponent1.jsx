"use client"
import React from 'react'
import { Field, useFormikContext } from 'formik'

const SelectComponent1 = ({
    name,
    label,
    placeholder = 'Select an option',
    value,
    onChange,
    onBlur,
    disabled = false,
    required = false,
    options = [],
    className = '',
    labelClassName = '',
    containerClassName = '',
    // Style customizations
    backgroundColor = 'bg-white/10',
    borderColor = 'border-gray-600',
    textColor = 'text-white',
    placeholderColor = 'text-gray-400',
    focusBorderColor = 'focus:border-white/30',
    focusRingColor = 'focus:ring-white/20',
    errorClassName = 'text-red-300',
    // Formik integration
    useFormik = false,
    showValidationOnSubmit = false,
    hasSubmitted = false,
    ...props
}) => {
    const formik = useFormikContext?.() || null

    const baseSelectClasses = `
        w-full px-4 py-3 border rounded-lg 
        focus:outline-none focus:ring-2 
        transition-all backdrop-blur-sm
        appearance-none cursor-pointer
        ${backgroundColor}
        ${borderColor}
        ${textColor}
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
        relative
        ${containerClassName}
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

    // Custom dropdown arrow icon
    const DropdownIcon = () => (
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
        </div>
    )

    if (useFormik) {
        return (
            <div className={containerClasses}>
                {label && (
                    <label htmlFor={name} className={labelClasses}>
                        {label}
                        {shouldShowRequired() && <sup className="text-red-400 ml-1">*required</sup>}
                        {fieldError && !shouldShowRequired() && <sup className={`${errorClassName} ml-1`}>*{fieldError}</sup>}
                    </label>
                )}
                <div className="relative">
                    <Field
                        as="select"
                        id={name}
                        name={name}
                        disabled={disabled}
                        className={baseSelectClasses}
                        {...props}
                    >
                        <option value="" disabled className={placeholderColor}>
                            {placeholder}
                        </option>
                        {options.map((option) => (
                            <option
                                key={option.value}
                                value={option.value}
                                className="bg-gray-800 text-white"
                            >
                                {option.label}
                            </option>
                        ))}
                    </Field>
                    <DropdownIcon />
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
                <select
                    id={name}
                    name={name}
                    value={value}
                    onChange={onChange}
                    onBlur={onBlur}
                    disabled={disabled}
                    className={baseSelectClasses}
                    {...props}
                >
                    <option value="" disabled className={placeholderColor}>
                        {placeholder}
                    </option>
                    {options.map((option) => (
                        <option
                            key={option.value}
                            value={option.value}
                            className="bg-gray-800 text-white"
                        >
                            {option.label}
                        </option>
                    ))}
                </select>
                <DropdownIcon />
            </div>
        </div>
    )
}

export default SelectComponent1