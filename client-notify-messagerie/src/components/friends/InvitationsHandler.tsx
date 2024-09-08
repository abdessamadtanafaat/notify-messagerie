import { useReducer, useCallback, useEffect, useRef } from 'react'
import { friendsReducer, initialState } from './FriendsReducer'
import { useFetchInvitations } from '../../hooks/useFetchInvitations'
import friendService from '../../services/friendService'
import { useAuth } from '../../contexte/AuthContext'
import { AnswerInvitationRequest, InvitationResponse } from '../../interfaces/MyFriends'
import { useFetchFriends } from '../../hooks/useFetchFriends'

export const useInvitationsHandler = (userId: string) => {

    const observerRef = useRef<HTMLDivElement>(null)
    const { refreshUserData } = useAuth()
    const [state, dispatch] = useReducer(friendsReducer, initialState)
    const { fetchInvitations, loadMoreInvitations } = useFetchInvitations(dispatch)
    const { fetchFriends } = useFetchFriends(dispatch)

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

            fetchFriends(userId)
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

    return {
        state,
        observerRef,
        onConfirm,
        onDelete,
    }

}