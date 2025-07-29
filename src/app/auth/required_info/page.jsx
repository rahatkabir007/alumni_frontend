"use client"
import { useSearchParams } from 'next/navigation';
import React from 'react'

const page = () => {

    const searchParams = useSearchParams();

    const user = searchParams.get('user');
    console.log("🚀 ~ page ~ user:", user)
    return (
        <div>page</div>
    )
}

export default page