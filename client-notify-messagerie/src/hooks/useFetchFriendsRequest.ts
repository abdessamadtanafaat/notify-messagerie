import { useState, useCallback } from 'react'
import { Action } from '../components/friends/FriendsReducer'
import friendService from '../services/friendService'

export const useFetchFriendsRequest = (dispatch: React.Dispatch<Action>) => {
    const [page, setPage] = useState(1)
    const [isFetching, setIsFetching] = useState(false) 
    const [HasMoreFriendsRequests, setHasMoreFriendsRequests] = useState(true)


    const fetchFriendsRequests = useCallback(
        async (userId: string) => {
            setIsFetching(true)
            dispatch({ type: 'SET_LOADING', payload: true }) // loading for load data
            try {
                const result = await friendService.fetchFriendsRequests(userId,1, 10)
                dispatch({ type: 'SET_FRIENDS_REQUESTS', payload: result })
                setPage(2) // Next page to load will be 2

                if (result.length < 10) {
                    setHasMoreFriendsRequests(false)
                }

            } catch (error) {
                console.error(error)
            } finally {
                setIsFetching(false)
                dispatch({ type: 'SET_LOADING', payload: false })

            }
        },
        [dispatch]
    )

    const loadMoreFriendsRequests = useCallback(
        async (userId: string) => {
            if (isFetching || !HasMoreFriendsRequests) return 
            setIsFetching(true)
            dispatch({ type: 'SET_LOADING_MORE_FRIENDS_REQUESTS', payload: true })
                try {
                    const result = await friendService.fetchFriendsRequests(userId,page, 10)
                    dispatch({ type: 'ADD_MORE_FRIENDS_REQUESTS', payload: result }) // Appends to current search results
                    setPage(prev => prev + 1)

                    if (result.length < 10) {
                        setHasMoreFriendsRequests(false)
                    }

                } catch (error) {
                    console.error(error)
                } finally {
                    setIsFetching(false)
                    dispatch({ type: 'SET_LOADING_MORE_FRIENDS_REQUESTS', payload: false })

                }
        },
        [isFetching, HasMoreFriendsRequests, page, dispatch]
    )

    return { fetchFriendsRequests, loadMoreFriendsRequests, isFetching }
}
