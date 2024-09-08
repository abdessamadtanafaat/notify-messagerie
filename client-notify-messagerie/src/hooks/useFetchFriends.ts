// import React, { useCallback, useEffect } from 'react'
// import friendService from '../services/friendService'
// import { Action } from '../components/friends/FriendsReducer'
// import { FriendsState } from '../components/friends/FriendsReducer' // Adjust the path if necessary
// import { MyFriends } from '../interfaces/MyFriends'


// export const useFetchFriends = (
//     userId: string | undefined,
//     dispatch: React.Dispatch<Action>,
//     state: FriendsState)=> {

//     const {page, hasMore} = state
//                 const fetchFriends = useCallback(async () => {
//                     try {
//                         if(userId) {
//                             const response: MyFriends[] = await friendService.fetchFriends(userId, page, 10)
//                             console.log(response)
//                             if (response.length < 10){
//                                 dispatch({type: 'SET_HAS_MORE', payload: false})
//                             }
//                             dispatch({type: 'SET_FRIENDS', payload: response})
//                             dispatch({ type: 'SET_LOADING_MORE_FRIENDS', payload: false }) // Stop loading after fetching more friends
//                     }
//                     }catch(err){
//                         console.error(err)
//                     }
//                 },[userId, dispatch, page]) 


//                 useEffect(() => {
//                     if (hasMore) {
//                         dispatch({type: 'SET_LOADING', payload: false})
//                         fetchFriends()
//                     }
//                 }, [dispatch, fetchFriends, hasMore])


//     const loadMoreFriends = () => {
//         if(hasMore) {
//             dispatch({ type: 'SET_LOADING_MORE_FRIENDS', payload: true }) // Set loading state to true when loading more friends
//             dispatch({type: 'SET_PAGE', payload: page + 1})
//         }
//     }
//     return { fetchFriends, loadMoreFriends}
// }



import { useState, useCallback } from 'react'
import { Action } from '../components/friends/FriendsReducer'
import friendService from '../services/friendService'

export const useFetchFriends = (dispatch: React.Dispatch<Action>) => {
    const [page, setPage] = useState(1)
    const [isFetching, setIsFetching] = useState(false)
    const [HasMoreFriends, setHasMoreFriends] = useState(true)


    const fetchFriends = useCallback(
        async (userId: string) => {
            setIsFetching(true)
            dispatch({ type: 'SET_LOADING', payload: true }) // loading for load data

            try {
                const result = await friendService.fetchFriends(userId,1, 10)
                dispatch({ type: 'SET_FRIENDS', payload: result })
                setPage(2) // Next page to load will be 2

                if (result.length < 10) {
                    setHasMoreFriends(false)
                }

            } catch (error) {
                console.error(error)
            } finally {
                setIsFetching(false)
                dispatch({ type: 'SET_LOADING', payload: false }) // loading for load data
            }
        },
        [dispatch]
    )

    const loadMoreFriends = useCallback(
        async (userId: string) => {
            if (isFetching || !HasMoreFriends) return 
            dispatch({ type: 'SET_LOADING_MORE_FRIENDS', payload: true })
            setIsFetching(true)
                try {
                    const result = await friendService.fetchFriends(userId,page, 10)
                    dispatch({ type: 'ADD_MORE_FRIENDS', payload: result }) // Appends to current search results
                    setPage(prev => prev + 1)

                    if (result.length < 10) {
                        setHasMoreFriends(false)
                    }

                } catch (error) {
                    console.error(error)
                } finally {
                    dispatch({ type: 'SET_LOADING_MORE_FRIENDS', payload: false })
                    setIsFetching(false)
                }
        },
        [isFetching, HasMoreFriends, page, dispatch]
    )

    return { fetchFriends, loadMoreFriends }
}

