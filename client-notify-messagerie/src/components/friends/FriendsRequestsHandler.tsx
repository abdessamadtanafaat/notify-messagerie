import { useReducer, useCallback, useEffect, useRef } from 'react'
import { friendsReducer, initialState } from './FriendsReducer'
import { useFetchFriendsRequest } from '../../hooks/useFetchFriendsRequest'
import friendService from '../../services/friendService'
import { useAuth } from '../../contexte/AuthContext'
import { CancelledFriendRequest } from '../../interfaces/MyFriends'

export const useFriendsRequestsHandler = (userId: string) => {
    const [state, dispatch] = useReducer(friendsReducer, initialState)
    const observerRef = useRef<HTMLDivElement>(null)
    const { refreshUserData } = useAuth()
    const { fetchFriendsRequests, loadMoreFriendsRequests } = useFetchFriendsRequest(dispatch)

    const handleScroll = useCallback(() => {
        const element = observerRef.current
        if (element) {
            const { scrollTop, scrollHeight, clientHeight } = element
            if (scrollHeight - scrollTop <= clientHeight + 50 && loadMoreFriendsRequests) {
                loadMoreFriendsRequests(userId)
            }
        }
    }, [loadMoreFriendsRequests, userId])

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
        onCancel,
    }
}
