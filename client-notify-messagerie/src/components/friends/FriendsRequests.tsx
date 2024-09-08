// FriendsRequestsComponent.tsx
import React from 'react'
import { useThemeContext } from '../../contexte/ThemeContext'
import { getAvatarUrl, getTimeDifference } from '../../utils/userUtils'
import LoadingSpinner from '../common/LoadingPage'
import LoadingMoreItemsSpinner from '../common/LoadingMoreItemsSpinner'
import { useFriendsRequestsHandler } from './FriendsRequestsHandler'
//import { useFetchFriends } from '../../hooks/useFetchFriends'
interface FriendsRequestListProps {
    userId: string
}

const FriendsRequest: React.FC<FriendsRequestListProps> = ({ userId }) => {

    const { theme } = useThemeContext()
    const { state, observerRef, onCancel } = useFriendsRequestsHandler(userId)
    const { loading, friendsRequests, loadingMoreFriendsRequests } = state


    return (
        <div
            className="relative grid grid-cols-1 gap-2 lg:grid-cols-2 pb-9 lg:gap-4 border-white rounded-md"
            ref={observerRef}
            style={{ height: '75%', overflowY: 'auto' }}
        >
            {loading ? (
                <div className="absolute inset-0 flex justify-center items-center"
                    style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)', height: '100px', width: '100%' }}
                >
                    <LoadingSpinner />
                </div>
            ) :

                friendsRequests.length === 0 ? (
                    <div className="flex justify-center items-center text-gray-500 dark:text-gray-300 h-full">
                        No Friends Request Found
                    </div>
                ) : (

                    friendsRequests.map((friendRequest, index) => (
                        <div
                            key={index}
                            className="relative flex items-center p-2 bg-gray-100 rounded-md dark:bg-gray-600"
                        >
                            {/* Container for "2 sem" and buttons */}
                            <div className='absolute top-1 right-4 justify-end flex flex-col text-xs text-gray-600 dark:text-white'>
                                <span className='justify-end flex text-[12px]'>
                                    {getTimeDifference(friendRequest.sentAt)}
                                </span>
                                <div className='flex space-x-2'>
                                    <button
                                        onClick={() => onCancel(friendRequest.user.id)}
                                        className='px-2 py-1 text-xs bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-150'
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>

                            <img
                                src={getAvatarUrl(theme, friendRequest.user ?? {})}
                                alt={friendRequest.user.firstName}
                                className="w-10 h-10 mr-2 rounded-sm"
                            />
                            <div className="flex-grow flex flex-col">
                                <span className="font-medium text-gray-800 dark:text-gray-200 text-xs">
                                    {friendRequest.user.firstName} {friendRequest.user.lastName}
                                </span>
                                <span className="text-xs text-gray-500 dark:text-gray-300">
                                    {friendRequest.nbMutualFriends ? `${friendRequest.nbMutualFriends} mutual friends` : ''}
                                </span>
                            </div>
                        </div>
                    ))
                )}

            {loadingMoreFriendsRequests &&
                <div className="absolute bottom-0 left-0 right-0 flex justify-center items-center py-4 bg-white dark:bg-gray-800">
                    <LoadingMoreItemsSpinner />
                </div>
            }

        </div>
    )

}

export default FriendsRequest
