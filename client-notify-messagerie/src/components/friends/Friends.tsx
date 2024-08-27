import React, { useEffect, useRef, useState } from 'react'
import { User } from '../../interfaces'
import friendService from '../../services/friendService'
import { useAuth } from '../../contexte/AuthContext'
import { DeleteIcon, Menu, MessageCircle, SearchIcon, StarIcon } from 'lucide-react'
import FriendsSkeleton from './FriendsSkeleton'


const Friends: React.FC = () => {

    const { user, refreshUserData } = useAuth()
    const [loading, setIsLoading] = useState<boolean>(true)
    const [friends, setFriends] = useState<User[]>([])
    //const [commonFriends, setCommonFriends] = useState<User[]>([])
    const [commonFriendsCount, setCommonFriendsCount] = useState<Map<string, number>>(new Map())


    const [menuOpen, setMenuOpen] = useState<string | null>(null)
    const menuRef = useRef<HTMLUListElement>(null)
    const fetchFriends = async () => {
        try {
            if (user) {
                const response: User[] = await friendService.fetchFriends(user.id)
                setFriends(response)
                console.log(response)
                console.log(friends)
                
                const friendIds = response.map(friend => friend.id)
                const countMap = new Map<string, number>()
                
                for (const friendId of friendIds) {
                    const commonFriends: User[] = await friendService.fetchCommonFriends(user.id ,friendId)
                    countMap.set(friendId, commonFriends.length)
                }
                setCommonFriendsCount(countMap)
            }
        } catch (err) {
            console.log(err)
        } finally {
            setIsLoading(false)
        }
    }


    const handleClickOutside = (event: MouseEvent | null) => {
        if (menuRef.current && !(menuRef.current as HTMLElement).contains(event?.target as Node)) {
            setMenuOpen(null)
        }
    }
    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [])

    const toggleMenu = (id: string) => {
        setMenuOpen(prev => (prev === id ? null : id))
    }

    useEffect(() => {
        fetchFriends()
    }, [])


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
                <div className="relative flex-shrink-0 ml-4">
                                    <input
                                        type='text'
                                        name='searchInDiscussion'
                                        placeholder='Search'
                                        //value={searchInDiscussion}
                                        //onChange={(e) => handleChange('searchInDiscussion', e.target.value)}
                                        autoFocus={true}
                                        className='w-full h-7 px-2 text-sm border-b-2 bg-gray-200 border-gray-600 rounded-2xl placeholder:font-light placeholder:text-gray-500 dark:bg-gray-700 focus:border-blue-400 focus:outline-none'
                                    />
                                    <SearchIcon
                                        className='w-3 h-3 text-blue-600 absolute right-2 top-1/2 transform -translate-y-1/2 dark:text-gray-400 dark:hover:text-white'
                                    />

                </div>
                </div>
                <ul className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-8">
                    {friends.map(friend => (
                        <li key={friend.id} className="flex items-center p-4 bg-gray-200 rounded-lg dark:bg-gray-700">
                            <img
                                src={friend.avatarUrl}
                                alt={friend.firstName}
                                className="w-20 h-20 mr-4 rounded-md"
                            />
                            <div className="flex-grow flex flex-col">
                                <span className="font-medium text-gray-900 dark:text-white">
                                    {friend.firstName} {friend.lastName}
                                </span>
                                <span className="text-sm text-gray-600 dark:text-gray-400">
                                {commonFriendsCount.has(friend.id)
                                    ? commonFriendsCount.get(friend.id)! > 0
                                        ? `${commonFriendsCount.get(friend.id)} mutual friends`
                                        :''
                                    : 'Loading...'} 
                                </span>
                            </div>
                            <button
                                onClick={() => toggleMenu(friend.id)}
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
                                        <li className="relative transition-transform transform hover:scale-105 group">
                                            <a
                                                href="#"
                                                className="flex items-center gap-2 px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 w-full"
                                            >
                                                <DeleteIcon className="w-5 h-5 text-gray-500 dark:text-gray-400 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors duration-200" />
                                                <span>Delete</span>
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
            </div>
            )}
        </div>
    )
}

export default Friends


