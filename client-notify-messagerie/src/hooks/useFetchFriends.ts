import React, { useEffect } from 'react'
import { User } from '../interfaces'
import friendService from '../services/friendService'
import { Action, FriendsState } from '../components/friends/FriendsReducer'

export const useFetchFriends = (
    userId: string | undefined,
    dispatch: React.Dispatch<Action>,
    state: FriendsState
) => {
    const { page, hasMore } = state

    useEffect(() => {
        const fetchFriends = async () => {
            try {
                dispatch({ type: 'SET_LOADING', payload: true })
                if (userId) {
                    const response: User[] = await friendService.fetchFriends(userId, page, 6)

                    // Check if the response is less than the requested amount, which indicates no more data
                    if (response.length < 6) {
                        dispatch({ type: 'SET_HAS_MORE', payload: false })
                    }

                    // Update friends list, appending new friends to the existing ones
                    dispatch({ type: 'SET_FRIENDS', payload: [...state.friends, ...response] })

                    const friendsIds = response.map((friend) => friend.id)
                    const countMap = new Map<string, number>()

                    for (const friendId of friendsIds) {
                        const commonFriends: User[] = await friendService.fetchCommonFriends(userId, friendId)
                        countMap.set(friendId, commonFriends.length)
                    }

                    dispatch({ type: 'SET_COMMON_FRIENDS_COUNT', payload: countMap })
                }
            } catch (err) {
                console.error(err)
            } finally {
                dispatch({ type: 'SET_LOADING', payload: false })
            }
        }

        if (hasMore) {
            fetchFriends()
        }

    }, [userId, dispatch, page, hasMore])

    const loadMoreFriends = () => {
        if (hasMore) {
            dispatch({ type: 'SET_PAGE', payload: page + 1 })
        }
    }

    return { loadMoreFriends }
}
