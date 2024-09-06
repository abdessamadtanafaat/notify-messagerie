// InvitationsComponent.tsx
import React, { useCallback, useEffect, useReducer, useRef } from 'react'
import { useThemeContext } from '../../contexte/ThemeContext'
import { getAvatarUrl, getTimeDifference } from '../../utils/userUtils'
import { friendsReducer, initialState } from './FriendsReducer'
import { useFetchInvitations } from '../../hooks/useFetchInvitations'
import friendService from '../../services/friendService'
import { useAuth } from '../../contexte/AuthContext'
import { AnswerInvitationRequest, InvitationResponse } from '../../interfaces/MyFriends'
import { useFetchFriends } from '../../hooks/useFetchFriends'
import LoadingSpinner from '../common/LoadingPage'
interface InvitationsFriendsListProps {
    userId: string

}

const Invitations: React.FC<InvitationsFriendsListProps> = ({ userId }) => {

    const observerRef = useRef<HTMLDivElement>(null)
    const { theme } = useThemeContext()
    const { refreshUserData } = useAuth()
    const [state, dispatch] = useReducer(friendsReducer, initialState)
    const { loading, invitations } = state


    const { fetchInvitations, loadMoreInvitations } = useFetchInvitations(dispatch)
    const { fetchFriends } = useFetchFriends(userId, dispatch, state)


    const handleScroll = useCallback(() => {
        const element = observerRef.current
        if (element) {
            const { scrollTop, scrollHeight, clientHeight } = element
            if (scrollHeight - scrollTop <= clientHeight + 50) {

                if (loadMoreInvitations) {
                    loadMoreInvitations(userId)
                }
            }
        }
    }, [loadMoreInvitations, userId])

    const onConfirm = async (friendId: string) => {
        try {
            const answerInvitationRequest: AnswerInvitationRequest = {
                userId: userId,
                friendId: friendId,
                answerInvitationChoice: InvitationResponse.Accepted,
            }
            console.log(answerInvitationRequest)
            await friendService.inswerInvitation(answerInvitationRequest)

            dispatch({ type: 'REMOVE_INVITATIONS', payload: friendId })

            fetchFriends()
            //console.log(confirmedFriend)
            refreshUserData()
        } catch (err) {
            console.error(err)
        } finally {
            refreshUserData()
        }
    }

    const onDelete = async (friendId: string) => {
        try {
            const answerInvitationRequest: AnswerInvitationRequest = {
                userId: userId,
                friendId: friendId,
                answerInvitationChoice: InvitationResponse.Rejected,
            }
            console.log(answerInvitationRequest)
            const response = await friendService.inswerInvitation(answerInvitationRequest)
            dispatch({ type: 'REMOVE_INVITATIONS', payload: friendId })
            console.log(response)
            refreshUserData()
        } catch (err) {
            console.error(err)
        } finally {
            refreshUserData()
        }
    }

    useEffect(() => {
        fetchInvitations(userId)
    }, [fetchInvitations, userId])

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
            invitations.length === 0 ? (
                <div className="flex justify-center items-center text-gray-500 dark:text-gray-300 h-full">
                    No Invitations Found
                </div>
            ) : (

                invitations.map((invitation, index) => (
                    <div
                        key={index}
                        className="relative flex items-center p-2 bg-gray-100 rounded-md dark:bg-gray-600"
                    >
                        {/* Container for "2 sem" and buttons */}
                        <div className='absolute top-1 right-4 justify-end flex flex-col text-xs text-gray-600 dark:text-white'>
                            <span className='justify-end flex text-[12px]'>
                                {getTimeDifference(invitation.sentAt)}
                            </span>
                            <div className='flex space-x-2'>
                                <button
                                    onClick={() => onConfirm(invitation.user.id)}
                                    className='px-2 py-1 text-xs bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-150'
                                >
                                    Confirm
                                </button>
                                <button
                                    onClick={() => onDelete(invitation.user.id)}
                                    className='px-2 py-1 text-xs bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition duration-150'
                                >
                                    Delete
                                </button>
                            </div>
                        </div>

                        <img
                            src={getAvatarUrl(theme, invitation.user ?? {})}
                            alt={invitation.user.firstName}
                            className="w-10 h-10 mr-2 rounded-sm"
                        />
                        <div className="flex-grow flex flex-col">
                            <span className="font-medium text-gray-800 dark:text-gray-200 text-xs">
                                {invitation.user.firstName} {invitation.user.lastName}
                            </span>
                            <span className="text-xs text-gray-500 dark:text-gray-300">
                                {invitation.nbMutualFriends ? `${invitation.nbMutualFriends} mutual friends` : ''}
                            </span>
                        </div>
                    </div>
                ))
            )}
        </div>
    )

}

export default Invitations
