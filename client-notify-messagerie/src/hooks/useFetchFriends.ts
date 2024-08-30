import React, { useCallback, useEffect } from 'react'
import { User } from '../interfaces'
import friendService from '../services/friendService'
import { Action } from '../components/friends/FriendsReducer'
import { FriendsState } from '../components/friends/FriendsReducer' // Adjust the path if necessary





export const useFetchFriends = (
    userId: string | undefined,
    dispatch: React.Dispatch<Action>,
    state: FriendsState)=> {

    const {page, hasMore} = state

                const fetchFriends = useCallback(async () => {
                    try {
                        dispatch({type: 'SET_LOADING', payload: true})
                        if(userId) {
                            const response: User[] = await friendService.fetchFriends(userId, page, 10)
                            console.log(response)
                            if (response.length < 6){
                                dispatch({type: 'SET_HAS_MORE', payload: false})
                            }
                            dispatch({type: 'SET_FRIENDS', payload: response})
                            
                            const friendsIds = response.map((friend)=> friend.id)
                            const countMap = new Map<string, number>()

                            for (const friendId of friendsIds) {
                                const commonFriends: User[] = await friendService.fetchCommonFriends(userId, friendId)
                                countMap.set(friendId, commonFriends.length)
                        } 
                        dispatch({type: 'SET_COMMON_FRIENDS_COUNT', payload: countMap})
                    }
                    }catch(err){
                        console.error(err)
                    }finally {
                        dispatch({type: 'SET_LOADING', payload: false})
                    }
                },[userId, dispatch, page]) 


                useEffect(() => {
                    if (hasMore) {
                        fetchFriends()
                    }
                }, [fetchFriends, hasMore])


    const loadMoreFriends = () => {
        if(hasMore) {
            dispatch({type: 'SET_PAGE', payload: page + 1})
        }
    }
    return { loadMoreFriends}
}
