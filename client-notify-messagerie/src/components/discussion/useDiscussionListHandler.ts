import { useEffect, useReducer, useRef } from 'react'
import { DiscussionReducer, initialState } from './DiscussionReducer'
import useHandleScroll from '../../hooks/useHandleScroll'
import { useFetchDiscussions } from '../../hooks/useFetchDiscussions'
import { useOutsideClick } from '../../hooks/useOutsideClick'
import { User } from '../../interfaces'
import { getAvatarUrl, getTimeDifference } from '../../utils/userUtils'

interface UseDiscussionListHandlerProps {
    userId: string;
    handleUserClick: (receiver: User, idDiscussion: string) => void;
}

const useDiscussionListHandler = ({ userId, handleUserClick }: UseDiscussionListHandlerProps) => {
    const [state, dispatch] = useReducer(DiscussionReducer, initialState)
    const { fetchDiscussions, loadMoreDiscussions } = useFetchDiscussions(dispatch)

    const menuRef = useRef<HTMLUListElement>(null)
    useOutsideClick(menuRef, () => { dispatch({ type: 'TOGGLE_MENU', payload: null }) })

    const { observerRef } = useHandleScroll({
        loadMoreFunction: loadMoreDiscussions,
        userId
    })

    const { loadingMoreDiscussions, menuOpen, discussions, loading } = state

    
    useEffect(() => {
        fetchDiscussions(userId)
        console.log(discussions)
    }, [fetchDiscussions, userId])

    return {
        observerRef,
        loading,
        discussions,
        loadingMoreDiscussions,
        menuOpen,
        dispatch,
        menuRef,
        handleUserClick,
        getAvatarUrl,
        getTimeDifference,
    }
}

export default useDiscussionListHandler
