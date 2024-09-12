import { useReducer, useEffect } from 'react'
import { friendsReducer, initialState } from './FriendsReducer'
import { useFetchInvitations } from '../../hooks/useFetchInvitations'
import friendService from '../../services/friendService'
import { useAuth } from '../../contexte/AuthContext'
import { AnswerInvitationRequest, InvitationResponse } from '../../interfaces/MyFriends'
import { useFetchFriends } from '../../hooks/useFetchFriends'
import useHandleScroll from '../../hooks/useHandleScroll'

export const useInvitationsHandler = (userId: string) => {

    const { refreshUserData } = useAuth()
    const [state, dispatch] = useReducer(friendsReducer, initialState)
    const { fetchInvitations, loadMoreInvitations } = useFetchInvitations(dispatch)
    const { fetchFriends } = useFetchFriends(dispatch)


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

    const { observerRef } = useHandleScroll({
        loadMoreFunction: loadMoreInvitations,
        userId
})

    return {
        state,
        observerRef,
        onConfirm,
        onDelete,
    }

}