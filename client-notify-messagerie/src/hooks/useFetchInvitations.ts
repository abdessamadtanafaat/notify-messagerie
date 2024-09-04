import { useState, useCallback } from 'react'
import { Action } from '../components/friends/FriendsReducer'
import friendService from '../services/friendService'

export const useFetchInvitations = (dispatch: React.Dispatch<Action>) => {
    const [page, setPage] = useState(1)
    const [loading, setLoading] = useState(false)
    const [HasMoreInvitations, setHasMoreInvitations] = useState(true)


    const fetchInvitations = useCallback(
        async (userId: string) => {
            setLoading(true)
            try {

                const result = await friendService.fetchInvitations(userId,1, 10)
                dispatch({ type: 'SET_INVITATIONS', payload: result })
                setPage(2) // Next page to load will be 2

                if (result.length < 10) {
                    setHasMoreInvitations(false)
                }

            } catch (error) {
                console.error(error)
            } finally {
                setLoading(false)
            }
        },
        [dispatch]
    )

    const loadMoreInvitations = useCallback(
        async (userId: string) => {
            if (loading || !HasMoreInvitations) return 
                setLoading(true)
                try {
                    const result = await friendService.fetchInvitations(userId,page, 10)
                    dispatch({ type: 'ADD_MORE_INVITATIONS', payload: result }) // Appends to current search results
                    setPage(prev => prev + 1)

                    if (result.length < 10) {
                        setHasMoreInvitations(false)
                    }

                } catch (error) {
                    console.error(error)
                } finally {
                    setLoading(false)
                }
        },
        [loading, HasMoreInvitations, page, dispatch]
    )

    return { fetchInvitations, loadMoreInvitations, loading }
}
