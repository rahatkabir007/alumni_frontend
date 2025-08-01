import * as Yup from 'yup';

// Common validation rules
export const validationRules = {
    name: Yup.string()
        .min(2, 'Name must be at least 2 characters')
        .max(100, 'Name cannot exceed 100 characters')
        .test('no-harmful-chars', 'Name contains invalid characters', (value) => {
            if (!value) return true;
            return !/<script|javascript:|on\w+=/i.test(value);
        })
        .required('Full name is required'),

    email: Yup.string()
        .email('Invalid email address')
        .required('Email is required'),

    phone: Yup.string()
        .min(10, 'Phone number must be at least 10 digits')
        .max(20, 'Phone number cannot exceed 20 characters')
        .matches(/^[\d\s\-\(\)\+]*$/, 'Phone number contains invalid characters')
        .required('Phone number is required'),

    location: Yup.string()
        .min(5, 'Location must be at least 5 characters')
        .max(500, 'Location cannot exceed 500 characters')
        .test('no-harmful-chars', 'Location contains invalid characters', (value) => {
            if (!value) return true;
            return !/<script|javascript:|on\w+=/i.test(value);
        })
        .required('Location/Address is required'),

    branch: Yup.string()
        .oneOf(['Jamalkhan', 'Patiya'], 'Please select a valid branch')
        .required('Branch is required'),

    alumni_type: Yup.string()
        .oneOf(['student', 'teacher', 'management'], 'Please select a valid alumni type')
        .required('Alumni type is required'),

    blood_group: Yup.string()
        .oneOf(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'], 'Please select a valid blood group')
        .required('Blood group is required'),

    profession: Yup.string()
        .max(200, 'Profession cannot exceed 200 characters')
        .test('no-harmful-chars', 'Profession contains invalid characters', (value) => {
            if (!value) return true;
            return !/<script|javascript:|on\w+=/i.test(value);
        }),

    batch: Yup.string()
        .max(100, 'Batch cannot exceed 100 characters')
        .test('no-harmful-chars', 'Batch contains invalid characters', (value) => {
            if (!value) return true;
            return !/<script|javascript:|on\w+=/i.test(value);
        }),

    bio: Yup.string()
        .max(2000, 'Bio cannot exceed 2000 characters')
        .test('no-harmful-chars', 'Bio contains invalid characters', (value) => {
            if (!value) return true;
            return !/<script|javascript:|on\w+=/i.test(value);
        }),

    joinedYear: Yup.number()
        .min(1998, 'Joined year must be after 1998')
        .max(new Date().getFullYear(), `Joined year cannot exceed ${new Date().getFullYear()}`)
        .required('Year joined is required')
        .nullable()
        .transform((value, originalValue) => originalValue === '' ? null : value),

    graduationYear: Yup.number()
        .min(1998, 'Graduation year must be after 1998')
        .max(new Date().getFullYear() + 10, `Graduation year cannot exceed ${new Date().getFullYear() + 10}`)
        .nullable()
        .transform((value, originalValue) => originalValue === '' ? null : value),

    leftAt: Yup.number()
        .min(1998, 'Left at year must be after 1998')
        .max(new Date().getFullYear(), `Left at year cannot exceed ${new Date().getFullYear()}`)
        .nullable()
        .transform((value, originalValue) => originalValue === '' ? null : value),

    isGraduated: Yup.boolean(),

    password: Yup.string()
        .min(8, 'Password must be at least 8 characters')
        .matches(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
            'Password must contain at least one uppercase letter, one lowercase letter, and one number'
        )
        .required('Password is required'),

    confirmPassword: Yup.string()
        .oneOf([Yup.ref('password'), null], 'Passwords must match')
        .required('Please confirm your password'),

    currentPassword: Yup.string()
        .required('Current password is required'),

    newPassword: Yup.string()
        .min(8, 'Password must be at least 8 characters')
        .matches(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
            'Password must contain at least one uppercase letter, one lowercase letter, and one number'
        )
        .required('New password is required'),

    confirmNewPassword: Yup.string()
        .oneOf([Yup.ref('newPassword'), null], 'Passwords must match')
        .required('Please confirm your new password'),
};

// Registration Step 1 Schema - Extended with all required fields
export const RegistrationStep1Schema = Yup.object().shape({
    name: validationRules.name,
    email: validationRules.email,
    alumni_type: validationRules.alumni_type,
    branch: validationRules.branch,
    phone: validationRules.phone,
    location: validationRules.location,
    blood_group: validationRules.blood_group,
    joinedYear: validationRules.joinedYear,
    batch: Yup.string().when('alumni_type', {
        is: 'student',
        then: (schema) => validationRules.batch.required('Batch is required for students'),
        otherwise: (schema) => validationRules.batch
    }),
    isGraduated: Yup.boolean().when('alumni_type', {
        is: 'student',
        then: (schema) => validationRules.isGraduated.required('Education status is required for students'),
        otherwise: (schema) => validationRules.isGraduated
    }),
    graduationYear: Yup.number().when(['alumni_type', 'isGraduated'], {
        is: (alumni_type, isGraduated) => alumni_type === 'student' && isGraduated === true,
        then: (schema) => validationRules.graduationYear.required('Graduation year is required when graduated'),
        otherwise: (schema) => validationRules.graduationYear
    }),
    leftAt: Yup.number().when(['alumni_type', 'isGraduated'], {
        is: (alumni_type, isGraduated) => alumni_type === 'student' && isGraduated === false,
        then: (schema) => validationRules.leftAt.required('Year left is required when not graduated'),
        otherwise: (schema) => validationRules.leftAt
    })
});

// Registration Step 2 Schema
export const RegistrationStep2Schema = Yup.object().shape({
    password: validationRules.password,
    confirmPassword: validationRules.confirmPassword,
});

// Profile Update Schema with conditional validation
export const ProfileUpdateSchema = Yup.object().shape({
    name: validationRules.name,
    phone: validationRules.phone,
    location: validationRules.location,
    branch: validationRules.branch,
    blood_group: validationRules.blood_group,
    profession: validationRules.profession,
    batch: Yup.string().when('alumni_type', {
        is: 'student',
        then: (schema) => validationRules.batch.required('Batch is required for students'),
        otherwise: (schema) => validationRules.batch
    }),
    bio: validationRules.bio,
    joinedYear: validationRules.joinedYear,
    isGraduated: validationRules.isGraduated,
    graduationYear: Yup.number().when('isGraduated', {
        is: true,
        then: (schema) => validationRules.graduationYear.required('Graduation year is required when graduated'),
        otherwise: (schema) => validationRules.graduationYear
    }),
    leftAt: Yup.number().when('isGraduated', {
        is: false,
        then: (schema) => validationRules.leftAt.required('Year left is required when not graduated'),
        otherwise: (schema) => validationRules.leftAt
    })
});

// Password Change Schema
export const PasswordChangeSchema = Yup.object().shape({
    currentPassword: validationRules.currentPassword,
    newPassword: validationRules.newPassword,
    confirmNewPassword: validationRules.confirmNewPassword,
});

// Login Schema
export const LoginSchema = Yup.object().shape({
    email: validationRules.email,
    password: Yup.string().min(1, 'Password is required').required('Password is required')
});

// Required Info Schema (for OAuth users) - Updated to include password
export const RequiredInfoSchema = Yup.object().shape({
    alumni_type: validationRules.alumni_type,
    branch: validationRules.branch,
    phone: validationRules.phone,
    location: validationRules.location,
    blood_group: validationRules.blood_group,
    joinedYear: validationRules.joinedYear,
    batch: Yup.string().when('alumni_type', {
        is: 'student',
        then: (schema) => validationRules.batch.required('Batch is required for students'),
        otherwise: (schema) => validationRules.batch
    }),
    isGraduated: Yup.boolean().when('alumni_type', {
        is: 'student',
        then: (schema) => validationRules.isGraduated.required('Education status is required for students'),
        otherwise: (schema) => validationRules.isGraduated
    }),
    graduationYear: Yup.number().when(['alumni_type', 'isGraduated'], {
        is: (alumni_type, isGraduated) => alumni_type === 'student' && isGraduated === true,
        then: (schema) => validationRules.graduationYear.required('Graduation year is required when graduated'),
        otherwise: (schema) => validationRules.graduationYear
    }),
    leftAt: Yup.number().when(['alumni_type', 'isGraduated'], {
        is: (alumni_type, isGraduated) => alumni_type === 'student' && isGraduated === false,
        then: (schema) => validationRules.leftAt.required('Year left is required when not graduated'),
        otherwise: (schema) => validationRules.leftAt
    })
});
