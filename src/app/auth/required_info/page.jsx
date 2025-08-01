"use client"

import RequiredInfo from '@/components/shared/RequiredInfo/RequiredInfo';
import { selectCurrentUser } from '@/redux/features/auth/authSlice';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSelector } from 'react-redux';

const page = () => {

    const router = useRouter();
    const searchParams = useSearchParams();
    const stringifyUser = searchParams.get('user');
    const user = stringifyUser ? JSON.parse(stringifyUser) : null;
    const currentUser = useSelector(selectCurrentUser)

    if (currentUser && currentUser.id === user?.id) {
        if (currentUser.isProfileCompleted) {
            router.push('/profile');
            return null;
        }
    }

    return (
        <RequiredInfo user={user} />
    )
}

export default page