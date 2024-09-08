import React, { useReducer, useCallback, useState } from 'react'
import { useAuth } from '../../contexte/AuthContext'
import { friendsReducer, initialState } from './FriendsReducer' // Adjust the import path
import { useSearchUsers } from '../../hooks/useSearchUsers'
import FriendsList from './FriendsList'
import FriendsRequests from './FriendsRequests'
import Invitations from './Invitations'
import FriendsSearch from './FriendsSearch'
import FriendsSearchList from './FriendsSearchList'
import { useFetchFriends } from '../../hooks/useFetchFriends'

const Friends: React.FC = () => {
    const { user } = useAuth()
    const [state, dispatch] = useReducer(friendsReducer, initialState)
    const { searchReq } = state
    const { fetchFriends } = useFetchFriends(dispatch)

    const [activeTab, setActiveTab] = useState<'friends' | 'requests' | 'invitations'>('friends')

    const userId = user?.id ?? ''


    const { searchUsers } = useSearchUsers(dispatch)
    const { refreshUserData } = useAuth()

    const handleTabClick = (tab: 'friends' | 'requests' | 'invitations') => {
        setActiveTab(tab)
        fetchFriends(userId) // refresh friends data in switching ....
        refreshUserData()
        console.log(tab)
        console.log(user?.nbFriends)
    }

    const handleSearchChange = useCallback(
        (value: string) => {
            if (user && value.trim()) {
                searchUsers(user.id, value.trim())
            } else {
                dispatch({ type: 'SET_USERS_SEARCH', payload: [] })
            }
        },
        [searchUsers, user]
    )

    const handleClearSearch = useCallback(() => {
        dispatch({ type: 'SET_SEARCH_FRIENDS', payload: '' })
    }, [dispatch])


    if (!user) return null

    return (
        <div className="flex h-screen pl-16">
            <div className="flex-grow rounded-2xl pl-5 pr-5 pt-4 w-5 bg-white dark:bg-gray-800">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="hidden md:block font-bold text-sm md:text-xl text-start dark:text-white mb-6">
                        Friends
                    </h1>

                    <div className="flex items-center space-x-4">
                        {/* Tabs And search bar*/}
                        <div className={`flex-grow flex justify-center ${activeTab === 'friends' ? 'block' : 'hidden'}`} style={{ flexShrink: 0, width: 'auto' }}>
                            <FriendsSearch
                                searchReq={searchReq}
                                setSearchReq={(value) => dispatch({ type: 'SET_SEARCH_FRIENDS', payload: value })}
                                handleSearchChange={handleSearchChange}
                                handleClearSearch={handleClearSearch}
                            />
                        </div>

                        <span className={`whitespace-nowrap rounded-full px-2.5 py-0.5 text-sm ${activeTab === 'friends' ? 'bg-blue-500 text-white' : 'bg-blue-100 text-blue-700'} cursor-pointer transition-colors duration-300`}
                            onClick={() => handleTabClick('friends')}
                        >
                            Friends {user.nbFriends > 0 ? user.nbFriends : ''}
                        </span>
                        <span className={`whitespace-nowrap rounded-full px-2.5 py-0.5 text-sm ${activeTab === 'requests' ? 'bg-blue-500 text-white' : 'bg-blue-100 text-blue-700'} cursor-pointer transition-colors duration-300`}
                            onClick={() => handleTabClick('requests')}
                        >
                            Friends Request {user.nbFriendRequests > 0 ? user.nbFriendRequests : ''}
                        </span>
                        <span className={`whitespace-nowrap rounded-full px-2.5 py-0.5 text-sm ${activeTab === 'invitations' ? 'bg-blue-500 text-white' : 'bg-blue-100 text-blue-700'} cursor-pointer transition-colors duration-300`}
                            onClick={() => handleTabClick('invitations')}
                        >
                            Invitations {user.nbInvitations > 0 ? user.nbInvitations : ''}
                        </span>
                    </div>

                </div>


                {activeTab === 'friends' ? (
                    searchReq ? (
                        <FriendsSearchList
                            userId={userId}
                            searchReq={searchReq}
                        />
                    ) : (
                        <FriendsList
                            userId={userId}
                        />
                    )
                ) : activeTab === 'requests' ? (
                    <FriendsRequests userId={userId} />
                ) : activeTab === 'invitations' ? (
                    <Invitations userId={userId} />
                ) : null
                }
            </div>
        </div>

    )
}

export default Friends


