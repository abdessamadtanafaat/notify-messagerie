import React, { useCallback, useEffect, useReducer, useRef, useState } from 'react'
import { User } from '../../interfaces'
import { useAuth } from '../../contexte/AuthContext'
import { Message } from '../../interfaces/Discussion'
import messageService from '../../services/messageService'
import DiscussionSidebar from './DiscussionSidebar'
import { useWebSocket } from '../../hooks/webSocketHook'
import { useNotification } from '../../contexte/NotificationContext'
import WelcomeMessage from '../common/WelcomeMessage'
import LoadingSpinner from '../common/LoadingPage'
import { DiscussionReducer, initialState } from './DiscussionReducer'
import { useFetchDiscussions } from '../../hooks/useFetchDiscussions'
import { useOutsideClick } from '../../hooks/useOutsideClick'
import SearchBar from './SearchBar'
import DiscussionListSearch from './DiscussionListSearch'
import DiscussionList from './DiscussionList'
import LoadingMoreItemsSpinner from '../common/LoadingMoreItemsSpinner'

const DiscussionPage: React.FC = () => {
    const { setHasUnreadMessages } = useNotification()
    const [state, dispatch] = useReducer(DiscussionReducer, initialState)
    const { menuOpen, discussions, loading, loadingMoreDiscussions,
        loadingMoreSearchDiscussions, discussionsSearch,
        selectedUser, idDiscussion, messages } = state

    const [searchTerm, setSearchTerm] = useState('')
    const [fetchingDiscussions, setFetchingDiscussions] = useState(false)
    const [initialFetchComplete, setInitialFetchComplete] = useState(false)


    const { fetchDiscussions, loadMoreDiscussions } = useFetchDiscussions(dispatch)
    const { user, refreshUserData } = useAuth()
    const observerRef = useRef<HTMLDivElement>(null)
    const userId = user?.id
    const menuRef = useRef<HTMLUListElement>(null)

    useOutsideClick(menuRef, () => { dispatch({ type: 'TOGGLE_MENU', payload: null }) })

    const handleUserClick = async (receiver: User, idDiscussion: string) => {
        dispatch({ type: 'SET_SELECTED_USER', payload: { user: receiver, idDiscussion } })
        try {
            if (user) {
                const discussionData = await messageService.getDiscussion(receiver.id, user.id)
                dispatch({ type: 'SET_MESSAGES', payload: discussionData.messages })

                if (user?.id === discussionData.messages[discussionData.messages.length - 1].receiverId) {
                    sendSeenNotification(discussionData.messages[discussionData.messages.length - 1].id, discussionData.id, receiver)
                }
            }
            refreshUserData()
        } catch (error) {
            console.log('Failed to fetch messages')
        }
    }

    const handleNewMessage = (newMessage: Message) => {
        setHasUnreadMessages(true)
        const timestamp = newMessage.timestamp instanceof Date ? newMessage.timestamp : new Date(newMessage.timestamp)
        dispatch({
            type: 'UPDATE_DISCUSSION',
            payload: {
                newMessage,
                timestamp: timestamp.toISOString()
            }
        })
    }

    const { sendSeenNotification } = useWebSocket(user, handleNewMessage)

    useEffect(() => {
        const fetchInitialDiscussions = async () => {
            setFetchingDiscussions(true)
            try {
                await fetchDiscussions(userId ?? '')
                setInitialFetchComplete(true)
            } finally {
                setFetchingDiscussions(false)
            }
        }
        fetchInitialDiscussions()
    }, [fetchDiscussions, userId])

    const handleScroll = useCallback(() => {
        const element = observerRef.current
        if (element) {
            const { scrollTop, scrollHeight, clientHeight } = element
            const scrollableHeight = scrollHeight - clientHeight
            const buffer = 200 
    
            if (scrollableHeight - scrollTop <= buffer) {
                loadMoreDiscussions(userId ?? '')
            }
        }
    }, [loadMoreDiscussions, userId])
    
        // Reset scroll position when switching views
        // useEffect(() => {
        //     if (!searchTerm) {
        //         const element = observerRef.current
        //         if (element) {
        //             element.scrollTop = 0 // Reset scroll position
        //         }
        //     }
        // }, [searchTerm])


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

    const handleClearSearch = async () => {
        setSearchTerm('')
        dispatch({ type: 'SET_USERS_SEARCH', payload: [] })
        dispatch({ type: 'SET_DISCUSSIONS', payload: [] })

        setFetchingDiscussions(true)
        try {
            await fetchDiscussions(user?.id ?? '')
        } finally {
            setFetchingDiscussions(false)
        }
    }

    useEffect(() => {
        if (searchTerm === '') {
            handleClearSearch()
        }
    }, [searchTerm])


    return (
        <>
            {loading && !initialFetchComplete ? (
                <LoadingSpinner />
            ) : (
                <div className="flex h-screen pl-16">
                    <div className="flex-grow rounded-2xl pl-5 pr-5 pt-4 w-5 bg-white dark:bg-gray-800">
                        <div className="space-y-4 md:space-y-3 mt-5">
                            <h1 className="hidden md:block font-bold text-sm md:text-xl text-start dark:text-white">
                                Discussion
                            </h1>
                            <SearchBar 
                                searchTerm={searchTerm}
                                setSearchTerm={setSearchTerm}
                                onClearSearch={handleClearSearch}
                                setSearchResults={(results) => {
                                    dispatch({ type: 'SET_USERS_SEARCH', payload: results })
                                }}
                            />

                            {fetchingDiscussions && !searchTerm && (
                                <div className="mt-2">
                                    <LoadingMoreItemsSpinner />
                                </div>
                            )}

                            {searchTerm ? (
                                <DiscussionListSearch
                                    usersSearch={discussionsSearch}
                                    menuOpen={menuOpen}
                                    observerRef={observerRef}
                                    loadingMoreDiscussions={loadingMoreSearchDiscussions}
                                    handleUserClick={handleUserClick}
                                    dispatch={dispatch}
                                    menuRef={menuRef}
                                />
                            ) : (
                                <DiscussionList
                                    discussions={discussions}
                                    menuOpen={menuOpen}
                                    observerRef={observerRef}
                                    loadingMoreDiscussions={loadingMoreDiscussions}
                                    handleUserClick={handleUserClick}
                                    dispatch={dispatch}
                                    menuRef={menuRef}
                                />
                            )}

                        </div>
                    </div>

                    {selectedUser && (
                        <div className="flex-grow rounded-2xl bg-white dark:bg-gray-800 h-full shadow-xl ml-4 lg:ml-6">
                            <DiscussionSidebar
                                receiver={selectedUser}
                                idDiscussion={idDiscussion}
                                messages={messages}
                                onMessageSent={handleNewMessage}
                            />
                        </div>
                    )}
                    {!selectedUser && <WelcomeMessage />}
                </div>
            )}
        </>
    )
}

export default DiscussionPage
