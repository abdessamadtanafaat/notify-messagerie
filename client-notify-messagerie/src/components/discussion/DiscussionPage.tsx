/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback, useEffect, useReducer, useRef, useState } from 'react'
import { User } from '../../interfaces'
import { useAuth } from '../../contexte/AuthContext'
import { Discussion, Message } from '../../interfaces/Discussion'

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
import DiscussionList1 from './DiscussionList'

const DiscussionPage: React.FC = () => {

    const [selectedUser, setSelectedUser] = useState<User | null>(null)
    const [idDiscussion, setIdDiscussion] = useState<string>('')
    const [messages, setMessages] = useState<Message[]>([])
    const [usersSearch, setUsersSearch] = useState<Discussion[]>([])
    const { setHasUnreadMessages } = useNotification()

    const [state, dispatch] = useReducer(DiscussionReducer, initialState)
    const { menuOpen, discussions, loading, loadingMoreDiscussions } = state

    const { fetchDiscussions, loadMoreDiscussions } = useFetchDiscussions(dispatch)

    const { user, refreshUserData } = useAuth()
    const observerRef = useRef<HTMLDivElement>(null)

    const userId = user?.id


    const menuRef = useRef<HTMLUListElement>(null)
    useOutsideClick(menuRef, () => { dispatch({ type: 'TOGGLE_MENU', payload: null }) })

    const handleUserClick = async (receiver: User, idDiscussion: string) => {
        setSelectedUser(receiver)
        setIdDiscussion(idDiscussion)
        try {
            if (user) {
                const discussionData = await messageService.getDiscussion(receiver.id, user.id)
                setMessages(discussionData.messages)
                const lastMessage = messages[messages.length - 1]
                setIdDiscussion(discussionData.id)

                if (user?.id === lastMessage.receiverId) {
                    sendSeenNotification(lastMessage.id, lastMessage.discussionId, receiver)
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
        console.log(timestamp.toString())
        dispatch({
            type: 'UPDATE_DISCUSSION',
            payload: {
                newMessage,
                timestamp: timestamp.toISOString()
            }
        })

        setMessages(prevMessages => [...prevMessages, newMessage])
    }

    const { sendSeenNotification } = useWebSocket(user, handleNewMessage)

    useEffect(() => {
        fetchDiscussions(userId ?? '')
    }, [fetchDiscussions, userId])

    const handleScroll = useCallback(() => {
        const element = observerRef.current
        if (element) {
            const { scrollTop, scrollHeight, clientHeight } = element
            if (scrollHeight - scrollTop <= clientHeight + 50) {
                console.log(userId)
                loadMoreDiscussions(userId ?? '')
            }
        }
    }, [loadMoreDiscussions, userId])

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
        <>
            {loading ? (
                <LoadingSpinner />
            ) : (
                <div className="flex h-screen pl-16">
                    <div className="flex-grow rounded-2xl pl-5 pr-5 pt-4 w-5 bg-white dark:bg-gray-800">
                        <div className="space-y-4 md:space-y-3 mt-5">
                            <h1 className="hidden md:block font-bold text-sm md:text-xl text-start dark:text-white">
                                Discussion
                            </h1>

                            <SearchBar setSearchResults={setUsersSearch} />

                        {usersSearch?.length > 0 ? (
                            <DiscussionListSearch
                                usersSearch={usersSearch}
                                menuOpen={menuOpen}
                                observerRef={observerRef}
                                loadingMoreDiscussions={loadingMoreDiscussions} 
                                handleUserClick={handleUserClick}
                                dispatch={dispatch}
                                menuRef={menuRef}
                            />
                        ) : (
                            <DiscussionList1
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