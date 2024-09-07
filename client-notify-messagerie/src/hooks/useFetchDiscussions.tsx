import { useState, useCallback } from 'react'
import messageService from '../services/messageService'
import { Action } from '../components/discussion/DiscussionReducer'

export const useFetchDiscussions = (dispatch: React.Dispatch<Action>) => {
    const [page, setPage] = useState(1)
    const [loading, setLoading] = useState(false)
    const [HasMoreDiscussions, setHasMoreDiscussions] = useState(true)


    const fetchDiscussions = useCallback(
        async (userId: string) => {
            setLoading(true)
            dispatch({ type: 'SET_LOADING', payload: true }) // loading for load data

            try {
                const result = await messageService.getDiscussions(userId,1, 10)
                dispatch({ type: 'SET_DISCUSSIONS', payload: result })
                setPage(2) // Next page to load will be 2

                if (result.length < 10) {
                    setHasMoreDiscussions(false)
                }

            } catch (error) {
                console.error(error)
            } finally {
                setLoading(false)
                dispatch({ type: 'SET_LOADING', payload: false }) // loading for load data
            }
        },
        [dispatch]
    )

    const loadMoreDiscussions = useCallback(
        async (userId: string) => {
            if (loading || !HasMoreDiscussions) return 
                setLoading(true)
                try {
                    const result = await messageService.getDiscussions(userId,page, 10)
                    dispatch({ type: 'ADD_MORE_DISCUSSIONS', payload: result }) // Appends to current search results
                    setPage(prev => prev + 1)

                    if (result.length < 10) {
                        setHasMoreDiscussions(false)
                    }

                } catch (error) {
                    console.error(error)
                } finally {
                    setLoading(false)
                }
        },
        [loading, HasMoreDiscussions, page, dispatch]
    )

    return { fetchDiscussions, loadMoreDiscussions, loading }
}
