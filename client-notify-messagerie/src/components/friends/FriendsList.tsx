import React, { useCallback, useEffect, useRef } from 'react'
import { User } from '../../interfaces'
import { DeleteIcon, Menu, MessageCircle, StarIcon } from 'lucide-react'
import { Action } from './FriendsReducer'
import { getAvatarUrl } from '../../utils/userUtils'
import { useThemeContext } from '../../contexte/ThemeContext'


interface UserListProps {
    users: User[]
    commonFriendsCount: Map<string, number>
    toggleMenu: (id: string) => void
    dispatch: React.Dispatch<Action>
    menuRef: React.RefObject<HTMLUListElement>
    menuOpen: string | null
    loadMoreFriends: ()=> void

}

const FriendsList: React.FC<UserListProps> = ({ users, commonFriendsCount, toggleMenu, dispatch, menuRef, menuOpen,loadMoreFriends }) => {

    const observerRef = useRef<HTMLDivElement>(null) 
    const { theme } = useThemeContext()
    const handleScroll = useCallback(()=>{
        const element = observerRef.current
        if(element){
            const { scrollTop, scrollHeight, clientHeight } = element 
            if (scrollHeight - scrollTop <= clientHeight + 50) {
                loadMoreFriends()
        }
    }
    },[loadMoreFriends])

    useEffect(()=>{
        const element = observerRef.current
        if (element){
            element.addEventListener('scroll',handleScroll)
        }
        return () => {
            if(element) {
                element.removeEventListener('scroll',handleScroll)
            }
        }
    },[handleScroll])

    return (
<div
  className="grid grid-cols-1 gap-2 lg:grid-cols-2 lg:gap-4 border border-white rounded-md"
  ref={observerRef}
    style={{ height: '75%', overflowY: 'auto' }}
>
    {users.map((user, index) => (
        <div
            key={index}
            className="flex items-center p-2 bg-gray-100 rounded-md dark:bg-gray-600"
        >
            <img
                src={getAvatarUrl(theme, user ?? {})}
                alt={user.firstName}
                className="w-16 h-16 mr-2 rounded-sm"
            />
            <div className="flex-grow flex flex-col">
                <span className="font-medium text-gray-800 dark:text-gray-200 text-xs">
                    {user.firstName} {user.lastName}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-300">
                    {commonFriendsCount.has(user.id)
                        ? commonFriendsCount.get(user.id)! > 0
                            ? `${commonFriendsCount.get(user.id)} mutual friends`
                            : ''
                        : 'Loading...'}
                </span>
            </div>
            <div className="relative flex">
                <button
                    onClick={() => {
                        toggleMenu(user.id)
                        dispatch({ type: 'SET_SELECTED_FRIEND', payload: user })
                    }}
                    className="relative text-gray-500 dark:text-gray-300 focus:outline-none"
                >
                    <Menu className="h-2.5 w-2.5" /> {/* Smaller icon size */}
                </button>
                {menuOpen === user.id && (
                    <ul
                        ref={menuRef}
                        className="absolute z-50 cursor-pointer right-0 mt-1 w-20 bg-white border border-gray-300 dark:bg-gray-700 dark:border-gray-500 rounded-md shadow-md transition-opacity duration-200 opacity-100"
                        style={{ top: '100%' }} // Moves the menu below the button
                    >
                        <li className="relative transition-transform transform hover:scale-95 group">
                            <a
                                href="#"
                                className="flex items-center gap-1 px-2 py-1 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 w-full text-xs"
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
    ))}
</div>

)
}

export default FriendsList