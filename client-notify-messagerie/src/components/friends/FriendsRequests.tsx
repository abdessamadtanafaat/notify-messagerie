// FriendsRequestsComponent.tsx
import React, { useCallback, useEffect, useReducer, useRef } from 'react'
import { useThemeContext } from '../../contexte/ThemeContext'
import { getAvatarUrl, getTimeDifference } from '../../utils/userUtils'
import { friendsReducer, initialState } from './FriendsReducer'
import friendService from '../../services/friendService'
import { useAuth } from '../../contexte/AuthContext'
import { CancelledFriendRequest } from '../../interfaces/MyFriends'
import { useFetchFriendsRequest } from '../../hooks/useFetchFriendsRequest'
//import { useFetchFriends } from '../../hooks/useFetchFriends'
interface FriendsRequestListProps {
    userId: string
}

const FriendsRequest: React.FC<FriendsRequestListProps> = ({ userId }) => {

    const observerRef = useRef<HTMLDivElement>(null)
    const { theme } = useThemeContext()
    const { refreshUserData } = useAuth()
    const [state, dispatch] = useReducer(friendsReducer, initialState)
    const { friendsRequests } = state


    const { fetchFriendsRequests, loadMoreFriendsRequests, loading } = useFetchFriendsRequest(dispatch)
    //const { fetchFriends } = useFetchFriends(userId, dispatch, state)


    const handleScroll = useCallback(() => {
        const element = observerRef.current
        if (element) {
            const { scrollTop, scrollHeight, clientHeight } = element
            if (scrollHeight - scrollTop <= clientHeight + 50) {

                if (loadMoreFriendsRequests) {
                    loadMoreFriendsRequests(userId)
                }
            }
        }
    }, [loadMoreFriendsRequests, userId])


    const onCancel = async (friendId: string) => {
        try {
            const cancelledFriendRequest: CancelledFriendRequest = {
                userId: userId,
                friendId: friendId,
            }
            console.log(cancelledFriendRequest)
            const response = await friendService.cancelFriendRequest(cancelledFriendRequest)
            dispatch({ type: 'REMOVE_FRIEND_REQUEST', payload: friendId })
            console.log(response)
            refreshUserData()
        } catch (err) {
            console.error(err)
        } finally {
            refreshUserData()
        }
    }

    useEffect(() => {
        fetchFriendsRequests(userId)
    }, [fetchFriendsRequests, userId])

    useEffect(() => {
        const element = observerRef.current
        if (element) {
            element.addEventListener('scroll', handleScroll)
        }
        return () => {
            if (element) {
                element.removeEventListener('scroll', handleScroll)
            }
        }
    }, [handleScroll])

    return (
        <div
            className="grid grid-cols-1 gap-2 lg:grid-cols-2 pb-9 lg:gap-4 border-white rounded-md"
            ref={observerRef}
            style={{ height: '75%', overflowY: 'auto' }}
        >
            {friendsRequests.length === 0 ? (
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
        </div>
    )

}

export default FriendsRequest
