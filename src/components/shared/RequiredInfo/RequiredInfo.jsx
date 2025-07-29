"use client"
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { useRouter } from 'next/navigation';
import SelectComponent1 from '@/components/common/SelectComponent1';
import InputComponent1 from '@/components/common/InputComponent1';
import { useCompleteUserProfileMutation, useLazyGetCurrentUserQuery } from '@/redux/features/auth/authApi';
import { ToastMessage } from '@/utils/ToastMessage';
import { useDispatch } from 'react-redux';
import { setCredentials } from '@/redux/features/auth/authSlice';

const alumniTypeOptions = [
    { value: 'student', label: 'Student' },
    { value: 'teacher', label: 'Teacher' },
    { value: 'management', label: 'Management' }
];

const RequiredInfoSchema = Yup.object().shape({
    alumni_type: Yup.string()
        .oneOf(['student', 'teacher', 'management'], 'Please select a valid alumni type')
        .required('Alumni type is required'),
    branch: Yup.string()
        .required('Branch is required'),
    phone: Yup.string().required('Phone number is required'),
    location: Yup.string().required('Location is required'),
});

export default function RequiredInfo({ user }) {
    const router = useRouter();
    const dispatch = useDispatch();
    const [triggerGetUser] = useLazyGetCurrentUserQuery();
    const [completeProfile, { isLoading }] = useCompleteUserProfileMutation();

    const handleSubmit = async (values, { setSubmitting }) => {
        // TODO: handle API call here
        try {
            const response = await completeProfile({
                ...values,
                userId: user.id,
            }).unwrap();

            if (response.success) {
                const token = response.data.token
                if (!token) {
                    setError('Missing authentication token');
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
                        // console.log('Auth callback - Fetching complete user data from /auth/me...');
                        const userData = await triggerGetUser().unwrap();
                        // console.log('Auth callback - Complete user data fetched successfully:', userData);

                        // Validate that we received a proper user object
                        if (!userData || !userData.email || !userData.id) {
                            throw new Error('Invalid user data received from server');
                        }
                        // Set credentials with complete user data and token
                        dispatch(setCredentials({
                            user: userData, // This is the complete user object from /auth/me
                            token: token
                        }));

                        ToastMessage.notifySuccess('Login successful! Welcome!');
                        setSubmitting(false);
                        // Give a moment for the state to update before redirecting
                        setTimeout(() => {
                            router.replace('/');
                        }, 500);

                    } catch (fetchError) {
                        console.error('Auth callback - Failed to fetch user data:', fetchError);

                        // Clean up token if user fetch fails
                        localStorage.removeItem('token');

                        const errorMsg = fetchError.status === 401 ?
                            'Session expired. Please try logging in again.' :
                            fetchError.message || 'Failed to load user profile. Please try again.';

                        setError(errorMsg);
                        ToastMessage.notifyError(errorMsg);
                        setTimeout(() => {
                            router.push('/login');
                        }, 3000);
                    }
                }, 1000);
            } else {
                // Handle error case
                console.error('Profile completion failed:', response.message);
            }
        } catch (error) {
            console.error('Error completing profile:', error);
        }

    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900 py-12 px-4">
            <div className="max-w-md w-full space-y-8 bg-gray-800 p-8 rounded-lg shadow-lg">
                <h2 className="text-3xl font-bold text-white mb-4 text-center">Complete Your Profile</h2>
                <Formik
                    initialValues={{
                        name: user?.name || '',
                        email: user?.email || '',
                        alumni_type: '',
                        branch: '',
                        phone: '',
                        location: '',
                    }}
                    validationSchema={RequiredInfoSchema}
                    onSubmit={handleSubmit}
                >
                    {({ isSubmitting }) => (
                        <Form className="space-y-5">
                            <InputComponent1
                                name="name"
                                type="text"
                                label="Full Name"
                                disabled
                                value={user?.name || ''}
                                useFormik={true}
                                labelClassName="text-gray-300"
                                backgroundColor="bg-white/10"
                                borderColor="border-gray-600"
                                textColor="text-white"
                                placeholderColor="placeholder-gray-400"
                            />
                            <InputComponent1
                                name="email"
                                type="email"
                                label="Email Address"
                                disabled
                                value={user?.email || ''}
                                useFormik={true}
                                labelClassName="text-gray-300"
                                backgroundColor="bg-white/10"
                                borderColor="border-gray-600"
                                textColor="text-white"
                                placeholderColor="placeholder-gray-400"
                            />
                            <SelectComponent1
                                name="alumni_type"
                                label="Alumni Type"
                                placeholder="Select your alumni type"
                                options={alumniTypeOptions}
                                required
                                useFormik={true}
                                labelClassName="text-gray-300"
                                backgroundColor="bg-white/10"
                                borderColor="border-gray-600"
                                textColor="text-white"
                                placeholderColor="text-gray-400"
                            />
                            <SelectComponent1
                                name="branch"
                                type="text"
                                label="Branch"
                                placeholder="Enter your branch"
                                options={[
                                    { value: "Jamalkhan", label: "Jamalkhan" },
                                    { value: "Patiya", label: "Patiya" },
                                ]}
                                required
                                useFormik={true}
                                labelClassName="text-gray-300"
                                backgroundColor="bg-white/10"
                                borderColor="border-gray-600"
                                textColor="text-white"
                                placeholderColor="placeholder-gray-400"
                            />
                            <InputComponent1
                                name="phone"
                                type="text"
                                label="Phone Number"
                                placeholder="Enter your phone number"
                                required
                                useFormik={true}
                                labelClassName="text-gray-300"
                                backgroundColor="bg-white/10"
                                borderColor="border-gray-600"
                                textColor="text-white"
                                placeholderColor="placeholder-gray-400"
                            />
                            <InputComponent1
                                name="location"
                                type="text"
                                label="Address"
                                placeholder="Enter your address"
                                required
                                useFormik={true}
                                labelClassName="text-gray-300"
                                backgroundColor="bg-white/10"
                                borderColor="border-gray-600"
                                textColor="text-white"
                                placeholderColor="placeholder-gray-400"
                            />
                            <button
                                type="submit"
                                disabled={isSubmitting || isLoading}
                                className="w-full bg-white text-black py-3 px-4 rounded-lg font-semibold hover:bg-gray-100 transition-all"
                            >
                                {isSubmitting || isLoading ? 'Submitting...' : 'Submit'}
                            </button>
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    );
}