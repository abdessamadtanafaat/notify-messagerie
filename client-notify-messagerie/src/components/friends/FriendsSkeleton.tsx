import React from 'react'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

const FriendsSkeleton: React.FC = () => {
    return (
        <div className="flex h-screen pl-16">
            <div className="flex-grow rounded-2xl pl-5 pr-5 pt-4 bg-gray-100 dark:bg-gray-800 overflow-y-auto">
                {/* Skeleton for Header and Search Bar */}
                <div className="flex items-center justify-between mb-6">
                    <Skeleton width={150} height={30} className="bg-gray-300 dark:bg-gray-700" />
                </div>

                {/* Skeleton for List */}
                <ul className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-8">
                    {[...Array(5)].map((_, index) => (
                        <li key={index} className="flex items-center p-4 bg-gray-200 rounded-lg dark:bg-gray-700">
                            <Skeleton circle width={80} height={80} className="bg-gray-600 dark:bg-gray-600 mr-4" />
                            <div className="flex-grow flex flex-col">
                                <Skeleton enableAnimation width={200} height={20} className="bg-gray-400 dark:bg-gray-600" />
                                <Skeleton width={150} height={15} className="bg-gray-400 dark:bg-gray-600" />
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>




    )
}

export default FriendsSkeleton
