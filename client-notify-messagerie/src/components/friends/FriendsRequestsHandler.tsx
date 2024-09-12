import { useReducer, useEffect } from 'react'
import { friendsReducer, initialState } from './FriendsReducer'
import { useFetchFriendsRequest } from '../../hooks/useFetchFriendsRequest'
import friendService from '../../services/friendService'
import { useAuth } from '../../contexte/AuthContext'
import { CancelledFriendRequest } from '../../interfaces/MyFriends'
import useHandleScroll from '../../hooks/useHandleScroll'

export const useFriendsRequestsHandler = (userId: string) => {
    const [state, dispatch] = useReducer(friendsReducer, initialState)
    const { refreshUserData } = useAuth()
    const { fetchFriendsRequests, loadMoreFriendsRequests } = useFetchFriendsRequest(dispatch)

    const onCancel = async (friendId: string) => {
        try {
            const cancelledFriendRequest: CancelledFriendRequest = {
                userId: userId,
                friendId: friendId,
            }
            await friendService.cancelFriendRequest(cancelledFriendRequest)
            dispatch({ type: 'REMOVE_FRIEND_REQUEST', payload: friendId })
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

    const { observerRef } = useHandleScroll({
        loadMoreFunction: loadMoreFriendsRequests,
        userId
})

    return {
        state,
        observerRef,
        onCancel,
    }
}
