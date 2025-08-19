import React from 'react'
import ElegantCard from '@/components/common/ElegantCard'
import BlackTag from '@/components/common/BlackTag'

const GalleryCard = ({ item }) => {
    return (
        <ElegantCard
            key={item.id}
            className="overflow-hidden group cursor-pointer"
            onClick={() => openLightbox(item)}
        >
            <div className="relative">
                <div
                    className="h-48 bg-gradient-to-br from-gray-300 to-gray-400 group-hover:scale-105 transition-transform duration-300"
                    style={{
                        backgroundImage: `url(${item.image})`,
                        backgroundSize: 'contain',
                        backgroundPosition: 'center'
                    }}
                />
                <BlackTag className="absolute top-2 right-2" size="xs">
                    {item.category}
                </BlackTag>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                    <h3 className="text-white font-semibold text-sm">{item.title}</h3>
                    <p className="text-gray-200 text-xs">{item.year}</p>
                </div>
            </div>

            <div className="p-4">
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">{item.description}</p>

                <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                    <div className="flex items-center">
                        <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-emerald-500 rounded-full flex items-center justify-center text-white font-bold text-xs mr-2">
                            {item.uploadedBy.charAt(0)}
                        </div>
                        <span>{item.uploadedBy}</span>
                    </div>
                    <BlackTag
                        variant="subtle"
                        size="xs"
                        className={item.userType === 'teacher' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}
                    >
                        {item.userType === 'teacher' ? 'Teacher' : `Batch ${item.batch}`}
                    </BlackTag>
                </div>

                <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center space-x-3">
                        <span className="flex items-center">
                            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                            {item.likes}
                        </span>
                        <span className="flex items-center">
                            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                            {item.comments}
                        </span>
                    </div>
                </div>
            </div>
        </ElegantCard>
    )
}

export default GalleryCard