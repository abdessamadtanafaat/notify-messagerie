import { useCallback, useEffect, useReducer, useRef, useState } from 'react'
import { friendsReducer, initialState } from './FriendsReducer'
import { useFetchFriends } from '../../hooks/useFetchFriends'
import useDeleteFriend from '../../hooks/useDeleteFriend'
import { useAuth } from '../../contexte/AuthContext'
import { useOutsideClick } from '../../hooks/useOutsideClick'
import useHandleScroll from '../../hooks/useHandleScroll'

export const useFriendsListHandler = (userId: string) => {
    const [state, dispatch] = useReducer(friendsReducer, initialState)
    const {selectedFriend } = state
    const { fetchFriends, loadMoreFriends } = useFetchFriends(dispatch)
    const { deleteFriend } = useDeleteFriend({ user: useAuth().user, dispatch, selectedFriend })
    const menuRef = useRef<HTMLUListElement>(null)
    const { user } = useAuth()
    const [menuOpen, setMenuOpen] = useState<string | null>(null)


    useOutsideClick(menuRef, () => dispatch({ type: 'TOGGLE_MENU', payload: null }))

    const handleDelete = () => {
        if (selectedFriend) {
            deleteFriend(user?.id || '', selectedFriend.id)
        }
    }

    const toggleMenu = useCallback(
        (id: string) => {
            dispatch({ type: 'TOGGLE_MENU', payload: menuOpen === id ? null : id })
            console.log(id)
            setMenuOpen(prevMenuOpen => (prevMenuOpen === id ? null : id))
  
        },
        [menuOpen, dispatch]
    )

    useEffect(() => {
        fetchFriends(userId)
    }, [fetchFriends, userId])


    const { observerRef } = useHandleScroll({
        loadMoreFunction: loadMoreFriends,
        userId
})

    return {
        state,
        dispatch,
        observerRef,
        menuRef,
        toggleMenu,
        handleDelete,
    }
}
