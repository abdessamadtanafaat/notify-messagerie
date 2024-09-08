import { useCallback, useEffect, useReducer, useRef } from 'react'
import { friendsReducer, initialState } from './FriendsReducer'
import { useFetchFriends } from '../../hooks/useFetchFriends'
import useDeleteFriend from '../../hooks/useDeleteFriend'
import { useAuth } from '../../contexte/AuthContext'
import { useOutsideClick } from '../../hooks/useOutsideClick'

export const useFriendsListHandler = (userId: string) => {
    const [state, dispatch] = useReducer(friendsReducer, initialState)
    const { menuOpen, selectedFriend } = state
    const { fetchFriends, loadMoreFriends } = useFetchFriends(dispatch)
    const { deleteFriend } = useDeleteFriend({ user: useAuth().user, dispatch, selectedFriend })
    const observerRef = useRef<HTMLDivElement>(null)
    const menuRef = useRef<HTMLUListElement>(null)
    const { user } = useAuth()


    useOutsideClick(menuRef, () => dispatch({ type: 'TOGGLE_MENU', payload: null }))

    const handleScroll = useCallback(() => {
        const element = observerRef.current
        if (element) {
            const { scrollTop, scrollHeight, clientHeight } = element
            if (scrollHeight - scrollTop <= clientHeight + 50 && loadMoreFriends) {
                loadMoreFriends(userId)
            }
        }
    }, [loadMoreFriends, userId])

    const handleDelete = () => {
        if (selectedFriend) {
            deleteFriend(user?.id || '', selectedFriend.id)
        }
    }

    const toggleMenu = useCallback(
        (id: string) => {
            dispatch({ type: 'TOGGLE_MENU', payload: menuOpen === id ? null : id })
        },
        [menuOpen, dispatch]
    )

    useEffect(() => {
        fetchFriends(userId)
    }, [fetchFriends, userId])

    useEffect(() => {
        const element = observerRef.current
        if (element) {
            element.addEventListener('scroll', handleScroll)
        }
        return () => {
            if (element) {
                element.removeEventListener('scroll', handleScroll)
            }
        }
    }, [handleScroll])

    return {
        state,
        dispatch,
        observerRef,
        menuRef,
        toggleMenu,
        handleDelete,
    }
}
