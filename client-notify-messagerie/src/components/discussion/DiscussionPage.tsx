import React, { useCallback, useEffect, useReducer, useRef, useState } from 'react'
import { useAuth } from '../../contexte/AuthContext'
import WelcomeMessage from '../common/WelcomeMessage'
import LoadingSpinner from '../common/LoadingPage'
import { DiscussionReducer, initialState } from './DiscussionReducer'
import { useFetchDiscussions } from '../../hooks/useFetchDiscussions'
import { useOutsideClick } from '../../hooks/useOutsideClick'
import SearchBar from './SearchBar'
import DiscussionListSearch from './DiscussionListSearch'
import DiscussionList from './DiscussionList'
import LoadingMoreItemsSpinner from '../common/LoadingMoreItemsSpinner'
import { useSearchDiscussions } from '../../hooks/useSearchDiscussions'
import DiscussionSidebar from './DiscussionSidebar'
import messageService from '../../services/messageService'
import { Message } from '../../interfaces/Discussion'
import { useWebSocket } from '../../hooks/webSocketHook'
import { User } from '../../interfaces'
import { useNotification } from '../../contexte/NotificationContext'

const DiscussionPage: React.FC = () => {
    const [state, dispatch] = useReducer(DiscussionReducer, initialState)
    const {loading,searchReq,selectedUser,idDiscussion,messages, } = state

    const [fetchingDiscussions, setFetchingDiscussions] = useState(false)
    const [initialFetchComplete, setInitialFetchComplete] = useState(false)


    const { fetchDiscussions } = useFetchDiscussions(dispatch)
    const { user,refreshUserData } = useAuth()
    const userId = user?.id ??  ''
    
    const { searchDiscussions } = useSearchDiscussions(dispatch)
    
    const menuRef = useRef<HTMLUListElement>(null)
    useOutsideClick(menuRef, () => { dispatch({ type: 'TOGGLE_MENU', payload: null }) })

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
    

    const handleSearchChange = useCallback(
        (value: string) => {
            if (user && value.trim()) {
                searchDiscussions(user.id, value.trim())
            } else {
                dispatch({ type: 'SET_DISCUSSIONS_SEARCH', payload: [] })
            }
        },
        [searchDiscussions, user]
    )

    const handleClearSearch = useCallback(() => {
        dispatch({ type: 'SET_SEARCH_INPUT', payload: '' })
    }, [dispatch])
    
    const { setHasUnreadMessages } = useNotification()

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
                                searchReq={searchReq}
                                setSearchReq={(value) => dispatch({ type: 'SET_SEARCH_INPUT', payload: value })}
                                handleSearchChange={handleSearchChange}
                                handleClearSearch={handleClearSearch}
                            />

                            {fetchingDiscussions && !searchReq && (
                                <div className="mt-2">
                                    <LoadingMoreItemsSpinner />
                                </div>
                            )}

                            {searchReq ? (
                                <DiscussionListSearch
                                    userId= {userId}
                                    searchReq = {searchReq}
                                    handleUserClick={handleUserClick}
                                />
                            ) : (
                                <DiscussionList
                                    userId= {userId}
                                    handleUserClick={handleUserClick}
                                />
                            )}
                        </div>
                    </div>

                    {selectedUser ? (
                <div className="flex-grow rounded-2xl bg-white dark:bg-gray-800 h-full shadow-xl ml-4 lg:ml-6">
                    <DiscussionSidebar
                        receiver={selectedUser}
                        idDiscussion={idDiscussion}
                        messages={messages}
                        //onMessageSent={handleNewMessage}
                     />
                </div>
            ) : (
                <WelcomeMessage />
            )}

                </div>
            )}
        </>
    )
}

export default DiscussionPage
