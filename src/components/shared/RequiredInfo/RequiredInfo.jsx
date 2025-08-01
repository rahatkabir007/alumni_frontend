"use client"
import { Formik, Form } from 'formik';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { RequiredInfoSchema } from '@/utils/validationSchemas';
import { alumniTypeOptions, branchOptions, bloodGroupOptions } from '@/utils/formOptions';
import SelectComponent1 from '@/components/common/SelectComponent1';
import InputComponent1 from '@/components/common/InputComponent1';
import { useCompleteUserProfileMutation, useLazyGetCurrentUserQuery } from '@/redux/features/auth/authApi';
import { ToastMessage } from '@/utils/ToastMessage';
import { useDispatch } from 'react-redux';
import { setCredentials } from '@/redux/features/auth/authSlice';

// Alumni SVG Component (same as registration)
const AlumniSVG = () => (
    <svg viewBox="0 0 400 300" className="w-full h-full text-blue-600">
        <defs>
            <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#3B82F6" />
                <stop offset="100%" stopColor="#1E40AF" />
            </linearGradient>
        </defs>

        <rect x="100" y="120" width="200" height="120" fill="url(#grad1)" rx="8" />
        <rect x="120" y="140" width="30" height="40" fill="#E5E7EB" />
        <rect x="170" y="140" width="30" height="40" fill="#E5E7EB" />
        <rect x="220" y="140" width="30" height="40" fill="#E5E7EB" />
        <rect x="270" y="140" width="30" height="40" fill="#E5E7EB" />

        <polygon points="80,120 200,80 320,120" fill="#1F2937" />
        <rect x="195" y="60" width="10" height="40" fill="#374151" />
        <polygon points="205,65 205,85 240,75" fill="#EF4444" />

        <circle cx="150" cy="200" r="8" fill="#FDE68A" />
        <rect x="145" y="208" width="10" height="20" fill="#3B82F6" />
        <polygon points="140,208 160,208 150,200" fill="#1F2937" />

        <circle cx="200" cy="200" r="8" fill="#FDE68A" />
        <rect x="195" y="208" width="10" height="20" fill="#3B82F6" />
        <polygon points="190,208 210,208 200,200" fill="#1F2937" />

        <circle cx="250" cy="200" r="8" fill="#FDE68A" />
        <rect x="245" y="208" width="10" height="20" fill="#3B82F6" />
        <polygon points="240,208 260,208 250,200" fill="#1F2937" />

        <rect x="50" y="220" width="8" height="15" fill="#EF4444" transform="rotate(-10 54 227)" />
        <rect x="60" y="218" width="8" height="15" fill="#10B981" transform="rotate(-5 64 225)" />
        <rect x="70" y="220" width="8" height="15" fill="#F59E0B" transform="rotate(5 74 227)" />
    </svg>
);

export default function RequiredInfo({ user }) {
    const router = useRouter();
    const dispatch = useDispatch();
    const [triggerGetUser] = useLazyGetCurrentUserQuery();
    const [completeProfile, { isLoading }] = useCompleteUserProfileMutation();

    const handleSubmit = async (values, { setSubmitting }) => {
        try {
            const response = await completeProfile({
                ...values,
                userId: user.id,
                graduation_year: values.isGraduated ? values.graduationYear : null,
                left_at: values.isGraduated ? null : values.leftAt,
            }).unwrap();

            if (response.success) {
                const token = response.data.token
                if (!token) {
                    ToastMessage.notifyError('Missing authentication token');
                    setSubmitting(false)
                    setTimeout(() => {
                        router.push('/login');
                    }, 3000);
                    return;
                }

                localStorage.setItem('token', token);
                setTimeout(async () => {
                    try {
                        const userData = await triggerGetUser().unwrap();

                        if (!userData || !userData.email || !userData.id) {
                            throw new Error('Invalid user data received from server');
                        }

                        dispatch(setCredentials({
                            user: userData,
                            token: token
                        }));

                        ToastMessage.notifySuccess('Profile completed successfully!');
                        setSubmitting(false);
                        setTimeout(() => {
                            router.replace('/');
                        }, 500);

                    } catch (fetchError) {
                        console.error('Auth callback - Failed to fetch user data:', fetchError);
                        localStorage.removeItem('token');

                        const errorMsg = fetchError.status === 401 ?
                            'Session expired. Please try logging in again.' :
                            fetchError.message || 'Failed to load user profile. Please try again.';

                        ToastMessage.notifyError(errorMsg);
                        setTimeout(() => {
                            router.push('/login');
                        }, 3000);
                    }
                }, 1000);
            } else {
                console.error('Profile completion failed:', response.message);
            }
        } catch (error) {
            console.error('Error completing profile:', error);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex">
            <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 lg:py-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 min-h-[calc(100vh-2rem)] lg:min-h-[calc(100vh-4rem)]">
                    {/* Left Side - SVG */}
                    <div className="flex items-center justify-center order-2 lg:order-1">
                        <div className="max-w-md w-full">
                            <motion.div
                                initial={{ opacity: 0, x: -50 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.8 }}
                            >
                                <AlumniSVG />
                                <div className="text-center mt-6">
                                    <h3 className="text-2xl font-bold text-gray-800 mb-4">
                                        Complete Your Profile
                                    </h3>
                                    <p className="text-gray-600 leading-relaxed">
                                        Please provide the required information to complete your registration
                                        and join the CIHS community.
                                    </p>
                                </div>
                            </motion.div>
                        </div>
                    </div>

                    {/* Right Side - Form */}
                    <div className="flex items-center justify-center order-1 lg:order-2">
                        <div className="max-w-lg w-full space-y-6">
                            {/* Header */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="text-center"
                            >
                                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                                    Complete Profile
                                </h2>
                                <p className="text-gray-600 mb-4">
                                    Welcome {user?.name}! Just a few more details needed.
                                </p>
                            </motion.div>

                            {/* Form */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                                className=""
                            >
                                <Formik
                                    initialValues={{
                                        name: user?.name || '',
                                        email: user?.email || '',
                                        alumni_type: '',
                                        branch: '',
                                        phone: '',
                                        location: '',
                                        blood_group: '',
                                        joinedYear: '',
                                        batch: '',
                                        isGraduated: true,
                                        graduationYear: '',
                                        leftAt: '',
                                        password: '',
                                        confirmPassword: '',
                                    }}
                                    validationSchema={RequiredInfoSchema}
                                    onSubmit={handleSubmit}
                                >
                                    {({ isSubmitting, values, setFieldValue }) => (
                                        <Form className="space-y-4">
                                            <div className="space-y-3">
                                                {/* Pre-filled Information */}

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                    <InputComponent1
                                                        name="name"
                                                        type="text"
                                                        label="Full Name"
                                                        disabled
                                                        value={user?.name || ''}
                                                        backgroundColor="bg-gray-50"
                                                        borderColor="border-gray-200"
                                                        textColor="text-gray-700"
                                                    />

                                                    <InputComponent1
                                                        name="email"
                                                        type="email"
                                                        label="Email Address"
                                                        disabled
                                                        value={user?.email || ''}
                                                        backgroundColor="bg-gray-50"
                                                        borderColor="border-gray-200"
                                                        textColor="text-gray-700"
                                                    />
                                                </div>


                                                {/* Required Information */}
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                    <InputComponent1
                                                        name="phone"
                                                        type="tel"
                                                        label="Phone Number"
                                                        placeholder="Enter your phone number"
                                                        required
                                                        useFormik={true}
                                                        backgroundColor="bg-white"
                                                        borderColor="border-gray-300"
                                                        textColor="text-gray-900"
                                                        focusBorderColor="focus:border-black"
                                                        focusRingColor="focus:ring-black/20"
                                                    />

                                                    <SelectComponent1
                                                        name="blood_group"
                                                        label="Blood Group"
                                                        placeholder="Select your blood group"
                                                        options={bloodGroupOptions}
                                                        required
                                                        useFormik={true}
                                                        backgroundColor="bg-white"
                                                        borderColor="border-gray-300"
                                                        textColor="text-gray-900"
                                                        focusBorderColor="focus:border-black"
                                                        focusRingColor="focus:ring-black/20"
                                                    />
                                                </div>

                                                {/* Address field full width */}
                                                <div className="mt-3">
                                                    <InputComponent1
                                                        name="location"
                                                        type="text"
                                                        label="Location/Address"
                                                        placeholder="Enter your complete address"
                                                        required
                                                        useFormik={true}
                                                        backgroundColor="bg-white"
                                                        borderColor="border-gray-300"
                                                        textColor="text-gray-900"
                                                        focusBorderColor="focus:border-black"
                                                        focusRingColor="focus:ring-black/20"
                                                    />
                                                </div>

                                                {/* Institution Information */}
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                    <SelectComponent1
                                                        name="alumni_type"
                                                        label="Alumni Type"
                                                        placeholder="Select your alumni type"
                                                        options={alumniTypeOptions}
                                                        required
                                                        useFormik={true}
                                                        backgroundColor="bg-white"
                                                        borderColor="border-gray-300"
                                                        textColor="text-gray-900"
                                                        focusBorderColor="focus:border-black"
                                                        focusRingColor="focus:ring-black/20"
                                                    />

                                                    <SelectComponent1
                                                        name="branch"
                                                        label="Branch"
                                                        placeholder="Select your branch"
                                                        options={branchOptions}
                                                        required
                                                        useFormik={true}
                                                        backgroundColor="bg-white"
                                                        borderColor="border-gray-300"
                                                        textColor="text-gray-900"
                                                        focusBorderColor="focus:border-black"
                                                        focusRingColor="focus:ring-black/20"
                                                    />

                                                    <InputComponent1
                                                        name="joinedYear"
                                                        type="number"
                                                        label="Year Joined CIHS"
                                                        placeholder="Year you joined"
                                                        required
                                                        useFormik={true}
                                                        backgroundColor="bg-white"
                                                        borderColor="border-gray-300"
                                                        textColor="text-gray-900"
                                                        focusBorderColor="focus:border-black"
                                                        focusRingColor="focus:ring-black/20"
                                                    />

                                                    {/* Student-specific fields */}
                                                    {values.alumni_type === 'student' && (
                                                        <InputComponent1
                                                            name="batch"
                                                            label="Batch/Class"
                                                            placeholder="e.g., '15, '20"
                                                            required
                                                            useFormik={true}
                                                            backgroundColor="bg-white"
                                                            borderColor="border-gray-300"
                                                            textColor="text-gray-900"
                                                            focusBorderColor="focus:border-black"
                                                            focusRingColor="focus:ring-black/20"
                                                        />
                                                    )}
                                                </div>

                                                {/* Student education status and year fields */}
                                                {values.alumni_type === 'student' && (
                                                    <div className="space-y-3 mt-3">
                                                        {/* Education Status */}
                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                                Education Status <span className="text-red-500">*</span>
                                                            </label>
                                                            <div className="flex items-center space-x-6">
                                                                <label className="flex items-center">
                                                                    <input
                                                                        type="radio"
                                                                        name="isGraduated"
                                                                        checked={values.isGraduated === true}
                                                                        onChange={() => setFieldValue('isGraduated', true)}
                                                                        className="mr-2 text-black focus:ring-black"
                                                                    />
                                                                    <span className="text-sm text-gray-900">Graduated</span>
                                                                </label>
                                                                <label className="flex items-center">
                                                                    <input
                                                                        type="radio"
                                                                        name="isGraduated"
                                                                        checked={values.isGraduated === false}
                                                                        onChange={() => setFieldValue('isGraduated', false)}
                                                                        className="mr-2 text-black focus:ring-black"
                                                                    />
                                                                    <span className="text-sm text-gray-900">Left Early</span>
                                                                </label>
                                                            </div>
                                                        </div>

                                                        {/* Conditional Year Fields */}
                                                        {values.isGraduated ? (
                                                            <InputComponent1
                                                                name="graduationYear"
                                                                type="number"
                                                                label="Graduation Year"
                                                                placeholder="Year you graduated"
                                                                required
                                                                useFormik={true}
                                                                backgroundColor="bg-white"
                                                                borderColor="border-gray-300"
                                                                textColor="text-gray-900"
                                                                focusBorderColor="focus:border-black"
                                                                focusRingColor="focus:ring-black/20"
                                                            />
                                                        ) : (
                                                            <InputComponent1
                                                                name="leftAt"
                                                                type="number"
                                                                label="Year Left School"
                                                                placeholder="Year you left school"
                                                                required
                                                                useFormik={true}
                                                                backgroundColor="bg-white"
                                                                borderColor="border-gray-300"
                                                                textColor="text-gray-900"
                                                                focusBorderColor="focus:border-black"
                                                                focusRingColor="focus:ring-black/20"
                                                            />
                                                        )}
                                                    </div>
                                                )}

                                            </div>

                                            <div className="pt-4">
                                                <motion.button
                                                    whileHover={{ scale: 1.02 }}
                                                    whileTap={{ scale: 0.98 }}
                                                    type="submit"
                                                    disabled={isSubmitting || isLoading}
                                                    className="w-full bg-black text-white py-3 px-4 rounded-lg font-semibold hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-black/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                                >
                                                    {isSubmitting || isLoading ? (
                                                        <div className="flex items-center justify-center">
                                                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                                            Completing Profile...
                                                        </div>
                                                    ) : (
                                                        'Complete Profile'
                                                    )}
                                                </motion.button>
                                            </div>
                                        </Form>
                                    )}
                                </Formik>
                            </motion.div>

                            {/* Back to Login */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.6 }}
                                className="text-center"
                            >
                                <button
                                    onClick={() => router.push('/login')}
                                    className="flex items-center text-gray-500 hover:text-gray-700 text-sm font-medium transition-colors mx-auto"
                                >
                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                    </svg>
                                    Back to Login
                                </button>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}