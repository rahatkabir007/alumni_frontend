"use client"
import React from 'react'
import { Field, useFormikContext } from 'formik'

const TextareaComponent1 = ({
    name,
    label,
    placeholder,
    value,
    onChange,
    onBlur,
    disabled = false,
    required = false,
    rows = 4,
    maxLength,
    showCharCount = false,
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
    // Formik integration
    useFormik = false,
    resize = 'resize-none',
    showValidationOnSubmit = false,
    hasSubmitted = false,
    ...props
}) => {
    const formik = useFormikContext?.() || null

    const baseTextareaClasses = `
        w-full px-4 py-3 border rounded-lg 
        focus:outline-none focus:ring-2 
        transition-all backdrop-blur-sm
        ${resize}
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

    const charCountClasses = `
        text-xs text-gray-400 mt-1 text-right
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
                <Field name={name}>
                    {({ field, meta }) => (
                        <>
                            <textarea
                                {...field}
                                id={name}
                                placeholder={placeholder}
                                disabled={disabled}
                                rows={rows}
                                maxLength={maxLength}
                                className={baseTextareaClasses}
                                {...props}
                            />
                            {showCharCount && maxLength && (
                                <div className={charCountClasses}>
                                    {field.value?.length || 0}/{maxLength}
                                </div>
                            )}
                        </>
                    )}
                </Field>
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
            <textarea
                id={name}
                name={name}
                value={value}
                onChange={onChange}
                onBlur={onBlur}
                placeholder={placeholder}
                disabled={disabled}
                rows={rows}
                maxLength={maxLength}
                className={baseTextareaClasses}
                {...props}
            />
            {showCharCount && maxLength && (
                <div className={charCountClasses}>
                    {value?.length || 0}/{maxLength}
                </div>
            )}
        </div>
    )
}

export default TextareaComponent1
