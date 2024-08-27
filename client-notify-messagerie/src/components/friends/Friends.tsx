import React, { useEffect, useRef, useReducer } from 'react'
import { User } from '../../interfaces'
import friendService from '../../services/friendService'
import { useAuth } from '../../contexte/AuthContext'
import { ChevronLeft, DeleteIcon, Menu, MessageCircle, SearchIcon, StarIcon } from 'lucide-react'
import FriendsSkeleton from './FriendsSkeleton'
import DeleteFriendComponent from '../personnes/DeleteFriendComponent'
import userService from '../../services/userService'
import { toast } from 'react-toastify'
import { friendsReducer, initialState } from './FriendsReducer' // Adjust the import path





const Friends: React.FC = () => {
    const { user, refreshUserData } = useAuth()
    const [state, dispatch] = useReducer(friendsReducer, initialState)
    const { loading, friends, commonFriendsCount, selectedFriend, openPopUp, menuOpen, searchInDiscussion, usersSearch } = state

    const menuRef = useRef<HTMLUListElement>(null)

    const fetchFriends = async () => {
        try {
            if (user) {
                dispatch({ type: 'SET_LOADING', payload: true })
                const response: User[] = await friendService.fetchFriends(user.id)
                dispatch({ type: 'SET_FRIENDS', payload: response })

                const friendIds = response.map(friend => friend.id)
                const countMap = new Map<string, number>()

                for (const friendId of friendIds) {
                    const commonFriends: User[] = await friendService.fetchCommonFriends(user.id, friendId)
                    countMap.set(friendId, commonFriends.length)
                }

                dispatch({ type: 'SET_COMMON_FRIENDS_COUNT', payload: countMap })
            }
        } catch (err) {
            console.log(err)
        } finally {
            dispatch({ type: 'SET_LOADING', payload: false })
        }
    }
    const searchUsers = async (userId: string, searchReq: string) => {
        try {
            if (user) {
                const searchRequest = { userId, searchReq }
                const response = await userService.searchUsersByFirstNameOrLastName(searchRequest)
                dispatch({ type: 'SET_USERS_SEARCH', payload: response })

            }
        } catch (error) {
            console.log('Failed to fetch users.')
        }
        finally {
            dispatch({ type: 'SET_LOADING', payload: false })
        }

    }
    const handleClearSearch = () => {
        dispatch({ type: 'SET_SEARCH_DISCUSSION', payload: '' })
    }

    const handleClickOutside = (event: MouseEvent | null) => {
        if (menuRef.current && !(menuRef.current as HTMLElement).contains(event?.target as Node)) {
            dispatch({ type: 'TOGGLE_MENU', payload: null })
        }
    }

    const toggleMenu = (id: string) => {
        dispatch({ type: 'TOGGLE_MENU', payload: menuOpen === id ? null : id })
    }

    const handleDeleteFriend = async (userId: string, friendId: string) => {
        if (selectedFriend) {
            try {
                if (user) {
                    const unfriendRequest = { userId, friendId }
                    await userService.unfriend(unfriendRequest)
                    //toast.success(`Successfully unfriended ${friendId.firstName} ${friendId.lastName}`)
                    //refreshUserData()
                    dispatch({ type: 'REMOVE_FRIEND', payload: friendId })
                }
            } catch (err) {
                toast.error('Could not unfriend')
            }
            dispatch({ type: 'TOGGLE_POPUP', payload: false })
        }
    }

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [])

    useEffect(() => {
        fetchFriends()
    }, [])


    const handleChange = async (field: 'searchInDiscussion', value: string) => {
        if (field === 'searchInDiscussion') {
            dispatch({ type: 'SET_SEARCH_DISCUSSION', payload: value })


            if (user && value.trim()) {
                searchUsers(user.id, value.trim())
            }
            if (user && searchInDiscussion) {
                searchUsers(user.id, searchInDiscussion)
            } else {
                dispatch({ type: 'SET_USERS_SEARCH', payload: [] })

            }
        }
    }

    if (!user) return null

    return (
        <div className="flex h-screen pl-16">
            {loading ? (
                <FriendsSkeleton />
            ) : (
                <div className="flex-grow rounded-2xl pl-5 pr-5 pt-4 w-5 bg-white dark:bg-gray-800 overflow-y-auto">
                    <div className="flex items-center justify-between mb-6">
                        <h1 className="hidden md:block font-bold text-sm md:text-xl text-start dark:text-white mb-6">
                            Friends
                        </h1>
                        <div className="flex items-center space-x-2">
                            {searchInDiscussion && (
                                <ChevronLeft
                                    className='w-4 h-4 text-blue-600 cursor-pointer dark:text-gray-400 dark:hover:text-white'
                                    onClick={() => handleClearSearch()}
                                />
                            )}
                            <div className="relative flex-shrink-0 ml-4">
                                <input
                                    type='text'
                                    name='searchInDiscussion'
                                    placeholder='Search'
                                    value={searchInDiscussion}
                                    onChange={(e) => handleChange('searchInDiscussion', e.target.value)}
                                    className='w-full h-7 px-2 text-sm border-b-2 bg-gray-200 border-gray-600 rounded-2xl placeholder:font-light placeholder:text-gray-500 dark:bg-gray-700 focus:border-blue-400 focus:outline-none'
                                />
                                <SearchIcon className='w-3 h-3 text-blue-600 absolute right-2 top-1/2 transform -translate-y-1/2 dark:text-gray-400 dark:hover:text-white' />
                            </div>
                        </div>
                    </div>

                    {searchInDiscussion ? (

                        usersSearch?.length > 0 ? (

                            <ul className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-8">
                                {usersSearch.map((friend, index) => {
                                    return (
                                        <li key={index}
                                            className="flex items-center p-4 bg-gray-200 rounded-lg dark:bg-gray-700">
                                            <img src={friend.avatarUrl} alt={friend.firstName} className="w-20 h-20 mr-4 rounded-md" />
                                            <div className="flex-grow flex flex-col">
                                                <span className="font-medium text-gray-900 dark:text-white">{friend.firstName} {friend.lastName}</span>
                                                <span className="text-sm text-gray-600 dark:text-gray-400">
                                                    {commonFriendsCount.has(friend.id)
                                                        ? commonFriendsCount.get(friend.id)! > 0
                                                            ? `${commonFriendsCount.get(friend.id)} mutual friends`
                                                            : ''
                                                        : 'Loading...'}
                                                </span>
                                            </div>
                                            <button
                                                onClick={() => {
                                                    toggleMenu(friend.id)
                                                    dispatch({ type: 'SET_SELECTED_FRIEND', payload: friend })
                                                }}
                                                className="relative text-gray-600 dark:text-gray-400 focus:outline-none"
                                            >
                                                <Menu />
                                                {menuOpen === friend.id && (
                                                    <ul
                                                        ref={menuRef}
                                                        className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 dark:bg-gray-800 dark:border-gray-600 rounded-lg shadow-lg transition-opacity duration-200 opacity-100"
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
                                            </button>
                                        </li>
                                    )
                                })}
                            </ul>

                        ) : (
                            <p className="text-gray-500 dark:text-gray-400 text-sm text-center">No users found.</p>
                        )
                    ) : (

                        <ul className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-8">
                            {friends.map(friend => (
                                <li key={friend.id} className="flex items-center p-4 bg-gray-200 rounded-lg dark:bg-gray-700">
                                    <img src={friend.avatarUrl} alt={friend.firstName} className="w-20 h-20 mr-4 rounded-md" />
                                    <div className="flex-grow flex flex-col">
                                        <span className="font-medium text-gray-900 dark:text-white">{friend.firstName} {friend.lastName}</span>
                                        <span className="text-sm text-gray-600 dark:text-gray-400">
                                            {commonFriendsCount.has(friend.id)
                                                ? commonFriendsCount.get(friend.id)! > 0
                                                    ? `${commonFriendsCount.get(friend.id)} mutual friends`
                                                    : ''
                                                : 'Loading...'}
                                        </span>
                                    </div>
                                    <button
                                        onClick={() => {
                                            toggleMenu(friend.id)
                                            dispatch({ type: 'SET_SELECTED_FRIEND', payload: friend })
                                        }}
                                        className="relative text-gray-600 dark:text-gray-400 focus:outline-none"
                                    >
                                        <Menu />
                                        {menuOpen === friend.id && (
                                            <ul
                                                ref={menuRef}
                                                className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 dark:bg-gray-800 dark:border-gray-600 rounded-lg shadow-lg transition-opacity duration-200 opacity-100"
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
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            )}
            {openPopUp && selectedFriend && (
                <DeleteFriendComponent
                    openPopUp={openPopUp}
                    closePopUp={() => dispatch({ type: 'TOGGLE_POPUP', payload: false })}
                    user={selectedFriend}
                    deleteFriend={handleDeleteFriend}
                />
            )}
        </div>
    )
}

export default Friends


