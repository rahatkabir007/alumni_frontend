"use client"
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setActiveSection } from '@/redux/features/profile/profileSlice'
import GalleryManagement from './AdminComponents/GalleryManagement/GalleryManagement'
import PostManagement from './AdminComponents/PostManagement/PostManagement'
import ProfileDetails from './ProfileDetails'
import ChangePassword from './ChangePassword'
import Posts from './RegularUserComponents/Posts/Posts'
import Gallery from './RegularUserComponents/Gallery/Gallery'
import BasicInfo from './RegularUserComponents/BasicInfo/BasicInfo'
import AdditionalInfo from './RegularUserComponents/AdditionalInfo/AdditionalInfo'

const MainContent = ({ userData }) => {
    const dispatch = useDispatch()
    const activeSection = useSelector((state) => state.profile.activeSection)

    const renderContent = () => {
        switch (activeSection) {
            case 'basic-info':
                return <BasicInfo userData={userData} />
            case 'posts':
                return <Posts userData={userData} />
            case 'post_management':
                return <PostManagement userData={userData} />
            case 'additional-info':
                return <AdditionalInfo userData={userData} />
            case 'change_password':
                return <ChangePassword />
            case 'gallery':
                return <Gallery userData={userData} />
            case 'gallery_management':
                return <GalleryManagement userData={userData} />
            default:
                return <BasicInfo userData={userData} />
        }
    }

    return (
        <div className="flex-1 p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen">
            {renderContent()}
        </div>
    )
}

export default MainContent
