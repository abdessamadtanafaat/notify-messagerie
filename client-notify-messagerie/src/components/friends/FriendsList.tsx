import React from 'react'
import { User } from '../../interfaces'
import { DeleteIcon, Menu, MessageCircle, StarIcon } from 'lucide-react'
import { Action } from './FriendsReducer'


interface UserListProps {
    users: User[]
    commonFriendsCount: Map<string, number>
    toggleMenu: (id: string) => void
    dispatch: React.Dispatch<Action>
    menuRef: React.RefObject<HTMLUListElement>
    menuOpen: string | null

}

const FriendsList: React.FC<UserListProps> = ({ users, commonFriendsCount, toggleMenu, dispatch, menuRef, menuOpen }) => (

    <ul className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-8">
        {users.map((user) => (
            <li key={user.id} className="flex items-center p-4 bg-gray-200 rounded-lg dark:bg-gray-700">
                <img src={user.avatarUrl} alt={user.firstName} className="w-20 h-20 mr-4 rounded-md" />
                <div className="flex-grow flex flex-col">
                    <span className="font-medium text-gray-900 dark:text-white">
                        {user.firstName} {user.lastName}
                    </span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                        {commonFriendsCount.has(user.id)
                            ? commonFriendsCount.get(user.id)! > 0
                                ? `${commonFriendsCount.get(user.id)} mutual friends`
                                : ''
                            : 'Loading...'}
                    </span>
                </div>
                <div className="relative flex ">
                <button
                    onClick={() => {
                        toggleMenu(user.id)
                        dispatch({ type: 'SET_SELECTED_FRIEND', payload: user })
                    }}
                    className="relative  text-gray-600 dark:text-gray-400 focus:outline-none"
                            >
                    <Menu className="h-5 w-5" />
                </button>
                {menuOpen === user.id && (
                    <ul
                        ref={menuRef}
                        className="absolute z-50 cursor-pointer right-0 mt-2 w-44 bg-white border border-gray-200 dark:bg-gray-800 dark:border-gray-600 rounded-lg shadow-lg transition-opacity duration-200 opacity-100"
                        style={{ top: '100%' }} // Moves the menu below the button

                        >
                        <li className="relative transition-transform transform hover:scale-105 group">
                            <a
                                href="#"
                                className="flex items-center gap-2 px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 w-full"
                            >
                                <MessageCircle className="w-5 h-5 text-gray-500 dark:text-gray-400 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors duration-200" />
                                <span>Send Message</span>
                            </a>
                        </li>
                        <li
                            className="relative transition-transform transform hover:scale-105 group"
                            onClick={() => dispatch({ type: 'TOGGLE_POPUP', payload: true })}
                        >
                            <a
                                className="flex items-center gap-2 px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 w-full"
                            >
                                <DeleteIcon className="w-5 h-5 text-gray-500 dark:text-gray-400 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors duration-200" />
                                <span>Unfriend</span>
                            </a>
                        </li>

                        <li className="relative transition-transform transform hover:scale-105 group">
                            <a
                                href="#"
                                className="flex items-center gap-2 px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 w-full"
                            >
                                <StarIcon className="w-5 h-5 text-gray-500 dark:text-gray-400 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors duration-200" />
                                <span>Star</span>
                            </a>
                        </li>
                    </ul>
                )}
            </div>
            </li>
        ))}
    </ul>
)

export default FriendsList