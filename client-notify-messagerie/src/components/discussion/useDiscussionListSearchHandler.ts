import { useEffect, useReducer, useRef, useState } from 'react'
import { DiscussionReducer, initialState } from './DiscussionReducer'
import useHandleScroll from '../../hooks/useHandleScroll'
import { useSearchDiscussions } from '../../hooks/useSearchDiscussions'
import { useOutsideClick } from '../../hooks/useOutsideClick'
import { User } from '../../interfaces'
import { getAvatarUrl, getTimeDifference } from '../../utils/userUtils'

interface UseDiscussionListSearchHandlerProps {
    userId: string;
    searchReq: string;
    handleUserClick: (receiver: User, idDiscussion: string) => void;
}

const useDiscussionListSearchHandler = ({
    userId,
    searchReq,
    handleUserClick
}: UseDiscussionListSearchHandlerProps) => {
    const [state, dispatch] = useReducer(DiscussionReducer, initialState)
    const { searchDiscussions, loadMoreDiscussions } = useSearchDiscussions(dispatch)
    const [isSearching, setIsSearching] = useState(false)
    const menuRef = useRef<HTMLUListElement>(null)

    useOutsideClick(menuRef, () => {
        dispatch({ type: 'TOGGLE_MENU', payload: null })
    })

    const { observerRef } = useHandleScroll({
        loadMoreFunction: loadMoreDiscussions,
        userId,
        searchReq
    })

    useEffect(() => {
        setIsSearching(true)
        searchDiscussions(userId, searchReq)

        return () => {
            setIsSearching(false)
        }
    }, [searchDiscussions, searchReq, userId])

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsSearching(false)
        }, 500)

        return () => clearTimeout(timer)
    }, [state.discussionsSearch, state.loadingMoreDiscussions])

    const { menuOpen, loadingMoreDiscussions, discussionsSearch } = state

    return {
        observerRef,
        isSearching,
        discussionsSearch,
        loadingMoreDiscussions,
        menuOpen,
        dispatch,
        menuRef,
        handleUserClick,
        getAvatarUrl,
        getTimeDifference
    }
}

export default useDiscussionListSearchHandler
