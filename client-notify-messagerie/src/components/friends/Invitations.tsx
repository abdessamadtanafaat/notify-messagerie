// InvitationsComponent.tsx
import React, { useCallback, useEffect, useReducer, useRef } from 'react'
import { useThemeContext } from '../../contexte/ThemeContext'
import { getAvatarUrl } from '../../utils/userUtils'
import {friendsReducer, initialState } from './FriendsReducer'
import { useFetchInvitations } from '../../hooks/useFetchInvitations'
interface InvitationsFriendsListProps {
    userId: string

}

const Invitations: React.FC<InvitationsFriendsListProps> = ({ userId }) => {

    const observerRef = useRef<HTMLDivElement>(null) 
    const { theme } = useThemeContext()
    const [state, dispatch] = useReducer(friendsReducer, initialState)
    const { invitations } = state


    const { fetchInvitations, loadMoreInvitations, loading } = useFetchInvitations(dispatch)


    const handleScroll = useCallback(()=>{
        const element = observerRef.current
        if(element){
            const { scrollTop, scrollHeight, clientHeight } = element 
            if (scrollHeight - scrollTop <= clientHeight + 50) {

                if (loadMoreInvitations) {
                    loadMoreInvitations(userId)
                }
        }
    }
    },[loadMoreInvitations])

    useEffect(() => {
        fetchInvitations(userId) // Fetch invitations when component mounts
    }, [fetchInvitations, userId])

    useEffect(()=>{
        const element = observerRef.current
        if (element){
            element.addEventListener('scroll',handleScroll)
        }
        return () => {
            if(element) {
                element.removeEventListener('scroll',handleScroll)
            }
        }
    },[handleScroll])
    
    return (
        <div
  className="grid grid-cols-1 gap-2 lg:grid-cols-2 pb-9 lg:gap-4 border-white rounded-md"
  ref={observerRef}
    style={{ height: '75%', overflowY: 'auto' }}
>
    {invitations.map((invitation, index) => (
        <div
            key={index}
            className="flex items-center p-2 bg-gray-100 rounded-md dark:bg-gray-600"
        >
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
                    {invitation.nbMutualFriends ?  `${invitation.nbMutualFriends} mutual friends`
                            : ''}
                </span>
            </div>
        </div>
    ))}
</div>
    )
}

export default Invitations
