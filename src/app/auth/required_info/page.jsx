"use client"

import RequiredInfo from '@/components/shared/RequiredInfo/RequiredInfo';
import { useSearchParams } from 'next/navigation';

const page = () => {

    const searchParams = useSearchParams();
    const stringifyUser = searchParams.get('user');
    const user = stringifyUser ? JSON.parse(stringifyUser) : null;

    return (
        <RequiredInfo user={user} />
    )
}

export default page