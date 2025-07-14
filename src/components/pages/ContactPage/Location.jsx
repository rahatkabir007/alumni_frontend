import ElegantCard from '@/components/common/ElegantCard'
import React from 'react'

const Location = () => {
    return (
        <div className="space-y-6">
            <ElegantCard>
                <h3 className="text-xl font-bold text-gray-900 mb-4">School Location</h3>
                <div className="h-64 bg-gray-200 rounded-lg mb-4 flex items-center justify-center">
                    <div className="text-center text-gray-500">
                        <svg className="w-16 h-16 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <p>Interactive Map</p>
                        <p className="text-sm">Google Maps Integration</p>
                    </div>
                </div>
                <div className="space-y-2 text-sm text-gray-600">
                    <p><strong>Address:</strong> Chittagong Ideal High School</p>
                    <p>Nasirabad, Chittagong-4220, Bangladesh</p>
                    <p><strong>Landmark:</strong> Near Nasirabad Government High School</p>
                </div>
            </ElegantCard>

            <ElegantCard>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Office Hours</h3>
                <div className="space-y-3">
                    <div className="flex justify-between">
                        <span className="text-gray-600">Monday - Thursday</span>
                        <span className="font-medium">9:00 AM - 5:00 PM</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-600">Friday</span>
                        <span className="font-medium">9:00 AM - 12:00 PM</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-600">Saturday</span>
                        <span className="font-medium">10:00 AM - 2:00 PM</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-600">Sunday</span>
                        <span className="font-medium text-red-600">Closed</span>
                    </div>
                </div>
            </ElegantCard>
        </div>
    )
}

export default Location