import { useState, useCallback } from 'react'
import userService from '../services/userService'
import { Action } from '../components/friends/FriendsReducer'

export const useSearchUsers = (dispatch: React.Dispatch<Action>) => {
    const [page, setPage] = useState(1)
    const [loading, setLoading] = useState(false)
    const [hasMoreUsers, setHasMoreUsers] = useState(true)


    const searchUsers = useCallback(
        async (userId: string, searchReq: string) => {
            setLoading(true)
            try {
                const searchRequest = { userId, searchReq }

                const result = await userService.searchUsersByFirstNameOrLastName(searchRequest, 1, 10)
                dispatch({ type: 'SET_USERS_SEARCH', payload: result })
                setPage(2) // Next page to load will be 2

                if (result.length < 10) {
                    setHasMoreUsers(false)
                }

            } catch (error) {
                console.error(error)
            } finally {
                setLoading(false)
            }
        },
        [dispatch]
    )

    const loadMoreUsers = useCallback(
        async (userId: string,searchReq: string) => {
            if (loading || !hasMoreUsers) return 
            console.log('Searching with userId:', userId)
            if (!loading) {
                setLoading(true)
                try {
                    const searchRequest = { userId, searchReq }

                    const result = await userService.searchUsersByFirstNameOrLastName(searchRequest, page, 10)
                    dispatch({ type: 'ADD_MORE_USERS', payload: result }) // Appends to current search results
                    setPage(prev => prev + 1)

                    if (result.length < 10) {
                        setHasMoreUsers(false)
                    }

                } catch (error) {
                    console.error(error)
                } finally {
                    setLoading(false)
                }
            }
        },
        [loading, hasMoreUsers, page, dispatch]
    )

    return { searchUsers, loadMoreUsers, loading }
}
