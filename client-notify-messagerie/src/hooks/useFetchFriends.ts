import React, { useCallback, useEffect } from 'react'
import friendService from '../services/friendService'
import { Action } from '../components/friends/FriendsReducer'
import { FriendsState } from '../components/friends/FriendsReducer' // Adjust the path if necessary
import { MyFriends } from '../interfaces/MyFriends'


export const useFetchFriends = (
    userId: string | undefined,
    dispatch: React.Dispatch<Action>,
    state: FriendsState)=> {

    const {page, hasMore} = state
                const fetchFriends = useCallback(async () => {
                    try {
                        if(userId) {
                            const response: MyFriends[] = await friendService.fetchFriends(userId, page, 10)
                            console.log(response)
                            if (response.length < 10){
                                dispatch({type: 'SET_HAS_MORE', payload: false})
                            }
                            dispatch({type: 'SET_FRIENDS', payload: response})
                            dispatch({ type: 'SET_LOADING_MORE_FRIENDS', payload: false }) // Stop loading after fetching more friends
                    }
                    }catch(err){
                        console.error(err)
                    }
                },[userId, dispatch, page]) 


                useEffect(() => {
                    if (hasMore) {
                        dispatch({type: 'SET_LOADING', payload: false})
                        fetchFriends()
                    }
                }, [dispatch, fetchFriends, hasMore])


    const loadMoreFriends = () => {
        if(hasMore) {
            dispatch({ type: 'SET_LOADING_MORE_FRIENDS', payload: true }) // Set loading state to true when loading more friends
            dispatch({type: 'SET_PAGE', payload: page + 1})
        }
    }
    return { fetchFriends, loadMoreFriends}
}
