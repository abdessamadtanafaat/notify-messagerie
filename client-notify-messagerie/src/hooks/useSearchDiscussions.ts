import { useState, useCallback } from 'react'
import messageService from '../services/messageService'
import { Action } from '../components/discussion/DiscussionReducer'

export const useSearchDiscussions = (dispatch: React.Dispatch<Action>) => {
    const [page, setPage] = useState(1)
    const [isFetching, setIsFetching] = useState(false)
    const [hasMoreDiscussions, setHasMoreDiscussions] = useState(true)


    const searchDiscussions = useCallback(
        async (userId: string, searchReq: string) => {
            setIsFetching(true)
            try {
                const searchRequest = { userId, searchReq }

                const result = await messageService.searchUsersByFirstNameOrLastNameOrLastMessageAsync(searchRequest, 1, 10)
                dispatch({ type: 'SET_DISCUSSIONS_SEARCH', payload: result })
                setPage(2) // Next page to load will be 2

                if (result.length < 10) {
                    setHasMoreDiscussions(false)
                }

            } catch (error) {
                console.error(error)
            } finally {
                setIsFetching(false)
            }
        },
        [dispatch]
    )

    const loadMoreDiscussions = useCallback(
        async (userId: string,searchReq?: string) => {
            if (isFetching || !hasMoreDiscussions) return 
            console.log('Searching with userId:', userId)
            if (!isFetching) {
                setIsFetching(true)
                dispatch({ type: 'SET_LOADING_MORE_SEARCH_DISCUSSIONS', payload: true })
                try {
                    const searchRequest = { userId, searchReq: searchReq || '' }
                    const result = await messageService.searchUsersByFirstNameOrLastNameOrLastMessageAsync(searchRequest, page, 10)
                    dispatch({ type: 'ADD_MORE_DISCUSSIONS', payload: result }) // Appends to current search results
                    setPage(prev => prev + 1)

                    if (result.length < 10) {
                        setHasMoreDiscussions(false)
                    }

                } catch (error) {
                    console.error(error)
                } finally {
                    setIsFetching(false)
                    dispatch({ type: 'SET_LOADING_MORE_SEARCH_DISCUSSIONS', payload: false })

                }
            }
        },
        [isFetching, hasMoreDiscussions, dispatch, page]
    )

    return { searchDiscussions, loadMoreDiscussions }
}
