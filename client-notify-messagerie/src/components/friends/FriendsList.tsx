import React, { useCallback, useEffect, useRef } from 'react'
import { DeleteIcon, Menu, MessageCircle, StarIcon } from 'lucide-react'
import { Action } from './FriendsReducer'
import { getAvatarUrl } from '../../utils/userUtils'
import { useThemeContext } from '../../contexte/ThemeContext'
import { MyFriends } from '../../interfaces/MyFriends'


interface UserListProps {
    users: MyFriends[]
    commonFriendsCount: Map<string, number>
    toggleMenu: (id: string) => void
    dispatch: React.Dispatch<Action>
    menuRef: React.RefObject<HTMLUListElement>
    menuOpen: string | null
    loadMoreFriends?: () => void
    loadMoreUsers?: () => void
}

const FriendsList: React.FC<UserListProps> = ({ users, toggleMenu, dispatch, menuRef, menuOpen, loadMoreFriends, loadMoreUsers }) => {

    const observerRef = useRef<HTMLDivElement>(null)
    const { theme } = useThemeContext()
    const handleScroll = useCallback(() => {
        const element = observerRef.current
        if (element) {
            const { scrollTop, scrollHeight, clientHeight } = element
            if (scrollHeight - scrollTop <= clientHeight + 50) {

                if (loadMoreUsers) {
                    loadMoreUsers()
                } else if (loadMoreFriends) {

                    loadMoreFriends()
                }
            }
        }
    }, [loadMoreFriends, loadMoreUsers])

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

    return (
        <div
            className="grid grid-cols-1 gap-2 lg:grid-cols-2 pb-9 lg:gap-4 border-white rounded-md"
            ref={observerRef}
            style={{ height: '75%', overflowY: 'auto' }}
        >
            {users.length === 0 ? (
                <div className="flex justify-center items-center text-gray-500 dark:text-gray-300 h-full">
                    No Friends Found
                </div>
            ) : (
                users.map((friend, index) => (
                    <div
                        key={index}
                        className="flex items-center p-2 bg-gray-100 rounded-md dark:bg-gray-600"
                    >
                        <img
                            src={getAvatarUrl(theme, friend.user ?? {})}
                            alt={friend.user.firstName}
                            className="w-10 h-10 mr-2 rounded-sm"
                        />
                        <div className="flex-grow flex flex-col">
                            <span className="font-medium text-gray-800 dark:text-gray-200 text-xs">
                                {friend.user.firstName} {friend.user.lastName}
                            </span>
                            <span className="text-xs text-gray-500 dark:text-gray-300">
                                {friend.nbMutualFriends ? `${friend.nbMutualFriends} mutual friends`
                                    : ''}
                            </span>
                        </div>
                        <div className="relative flex">
                            <button
                                onClick={() => {
                                    toggleMenu(friend.user.id)
                                    dispatch({ type: 'SET_SELECTED_FRIEND', payload: friend.user })
                                }}
                                className="relative text-gray-500 dark:text-gray-300 focus:outline-none"
                            >
                                <Menu className="h-2.5 w-2.5" /> {/* Smaller icon size */}
                            </button>
                            {menuOpen === friend.user.id && (
                                <ul
                                    ref={menuRef}
                                    className="absolute z-50 cursor-pointer right-0 mt-1 w-20 bg-white border-gray-300 dark:bg-gray-700 dark:border-gray-500 rounded-md shadow-md transition-opacity duration-200 opacity-100"
                                    style={{ top: '100%' }} // Moves the menu below the button
                                >
                                    <li className="relative transition-transform transform hover:scale-95 group">
                                        <a
                                            className="flex items-center gap-1 px-2 py-1 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 w-full text-xs"
                                            onClick={() => dispatch({ type: 'TOGGLE_MESSAGE', payload: true })}
                                        >
                                            <MessageCircle className="h-2.5 w-2.5 text-gray-500 dark:text-gray-300 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors duration-200" />
                                            <span className="text-xs">Message</span>
                                        </a>
                                    </li>
                                    <li
                                        className="relative transition-transform transform hover:scale-95 group"
                                        onClick={() => dispatch({ type: 'TOGGLE_POPUP', payload: true })}
                                    >
                                        <a
                                            className="flex items-center gap-1 px-2 py-1 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 w-full text-xs"
                                        >
                                            <DeleteIcon className="h-2.5 w-2.5 text-gray-500 dark:text-gray-300 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors duration-200" />
                                            <span className="text-xs">Unfriend</span>
                                        </a>
                                    </li>
                                    <li className="relative transition-transform transform hover:scale-95 group">
                                        <a
                                            href="#"
                                            className="flex items-center gap-1 px-2 py-1 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 w-full text-xs"
                                        >
                                            <StarIcon className="h-2.5 w-2.5 text-gray-500 dark:text-gray-300 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors duration-200" />
                                            <span className="text-xs">Star</span>
                                        </a>
                                    </li>
                                </ul>
                            )}
                        </div>
                    </div>
                )))}
        </div>

    )
}

export default FriendsList