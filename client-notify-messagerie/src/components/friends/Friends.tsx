import React, { useRef, useReducer, useCallback } from 'react'
import { useAuth } from '../../contexte/AuthContext'
import { ChevronLeft, SearchIcon } from 'lucide-react'
import FriendsSkeleton from './FriendsSkeleton'
import DeleteFriendComponent from '../personnes/DeleteFriendComponent'
import { friendsReducer, initialState } from './FriendsReducer' // Adjust the import path
import { useFetchFriends } from '../../hooks/useFetchFriends'
import { useOutsideClick } from '../../hooks/useOutsideClick'
import { useSearchUsers } from '../../hooks/useSearchUsers'
import useDeleteFriend from '../../hooks/useDeleteFriend'
import FriendsList from './FriendsList'
import { debounce } from '../../utils/debounce'





const Friends: React.FC = () => {
    const { user } = useAuth()
    const [state, dispatch] = useReducer(friendsReducer, initialState)
    const { loading, friends, commonFriendsCount, selectedFriend, openPopUp, menuOpen, searchInDiscussion, usersSearch } = state

    const menuRef = useRef<HTMLUListElement>(null)

    const { loadMoreFriends } = useFetchFriends(user?.id, dispatch, state)

    //useFetchFriends(user?.id, dispatch, state)
    useOutsideClick(menuRef, () => dispatch({ type: 'TOGGLE_MENU', payload: null }))
    const { searchUsers } = useSearchUsers({ user, dispatch })
    const { deleteFriend } = useDeleteFriend({ user, dispatch, selectedFriend })
    // Create a debounced version of the search function
    const debouncedSearch = useCallback(
        debounce((value: string) => {
            if (user && value.trim()) {
                searchUsers(user.id, value.trim())
            } else {
                dispatch({ type: 'SET_USERS_SEARCH', payload: [] })
            }
        }, 300), // Debounce delay of 500ms
        [searchUsers, user]
    )

    // Handle search input change and debounce
    const handleSearchChange = useCallback(
        (value: string) => {
            console.log('Handle search change:', value) // Debugging line
            dispatch({ type: 'SET_SEARCH_DISCUSSION', payload: value })
            debouncedSearch(value)
        },
        [debouncedSearch, dispatch]
    )

    const handleClearSearch = useCallback(() => {
        dispatch({ type: 'SET_SEARCH_DISCUSSION', payload: '' })
    }, [dispatch])

    const toggleMenu = useCallback(
        (id: string) => {
            dispatch({ type: 'TOGGLE_MENU', payload: menuOpen === id ? null : id })

        }, [menuOpen, dispatch]
    )

    const handleDelete = () => {
        if (user && selectedFriend) {
            deleteFriend(user.id, selectedFriend.id)
        }
    }

    
    if (!user) return null
    return (
        <div className="flex h-screen pl-16">
            {loading && state.page === 1 ? (
                <FriendsSkeleton />
            ) : (
                <div className="flex-grow rounded-2xl pl-5 pr-5 pt-4 w-5 bg-white dark:bg-gray-800">
                    <div className="flex items-center justify-between mb-6">
                        <h1 className="hidden md:block font-bold text-sm md:text-xl text-start dark:text-white mb-6">
                            Friends
                        </h1>
{/* <span
  className="whitespace-nowrap rounded-full border border-purple-500 px-2.5 py-0.5 text-sm text-purple-700"
>
  Live
</span> */}
            <div className="flex items-center space-x-2">
              {/* Live span aligned to the left */}
              <span className="whitespace-nowrap rounded-full bg-blue-100 px-2.5 py-0.5 text-sm text-blue-700">
                Fiends
              </span>
              <span className="whitespace-nowrap rounded-full bg-blue-100 px-2.5 py-0.5 text-sm text-blue-700">
              Friends Request
              </span>
              <span className="whitespace-nowrap rounded-full bg-blue-100 px-2.5 py-0.5 text-sm text-blue-700">
              Invitations
              </span>
            </div>
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
                                    onChange={(e) => handleSearchChange(e.target.value)}
                                    className='w-full h-7 px-2 text-sm border-b-2 bg-gray-200 border-gray-600 rounded-2xl placeholder:font-light placeholder:text-gray-500 dark:bg-gray-700 focus:border-blue-400 focus:outline-none'
                                />
                                <SearchIcon className='w-3 h-3 text-blue-600 absolute right-2 top-1/2 transform -translate-y-1/2 dark:text-gray-400 dark:hover:text-white' />
                            </div>
                        </div>
                    </div>

                    {searchInDiscussion ? (

                        usersSearch?.length > 0 ? (
                            <FriendsList
                                users={usersSearch}
                                commonFriendsCount={commonFriendsCount}
                                toggleMenu={toggleMenu}
                                dispatch={dispatch}
                                menuRef={menuRef}
                                menuOpen={menuOpen}
                                loadMoreFriends={loadMoreFriends}

                            />

                        ) : (
                            <p className="text-gray-500 dark:text-gray-400 text-sm text-center">No users found.</p>
                        )
                    ) : (

                        <>
                            <FriendsList
                                users={friends}
                                commonFriendsCount={commonFriendsCount}
                                toggleMenu={toggleMenu}
                                dispatch={dispatch}
                                menuRef={menuRef}
                                menuOpen={menuOpen}
                                loadMoreFriends={loadMoreFriends}
                            />
                        </>
                            
                    )}
                </div>
            )}
            {openPopUp && selectedFriend && (
                <DeleteFriendComponent
                    openPopUp={openPopUp}
                    closePopUp={() => dispatch({ type: 'TOGGLE_POPUP', payload: false })}
                    user={selectedFriend}
                    deleteFriend={handleDelete}
                />
            )}
        </div>
    )
}

export default Friends


