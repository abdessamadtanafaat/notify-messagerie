/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback, useEffect, useReducer, useRef, useState } from 'react'
import { User } from '../../interfaces'
import { CheckCheck, ChevronLeft, CircleEllipsis, SearchIcon } from 'lucide-react'
import { useAuth } from '../../contexte/AuthContext'
import { Discussion, Message } from '../../interfaces/Discussion'

import messageService from '../../services/messageService'
import DiscussionSidebar from './DiscussionSidebar'
import { useThemeContext } from '../../contexte/ThemeContext'
import { getAvatarUrl, getTimeDifference } from '../../utils/userUtils'
import { useWebSocket } from '../../hooks/webSocketHook'
import { useNotification } from '../../contexte/NotificationContext'
import { debounce } from '../../utils/debounce'
import WelcomeMessage from '../common/WelcomeMessage'
import LoadingSpinner from '../common/LoadingPage'
import { DiscussionReducer, initialState } from './DiscussionReducer'
import DiscussionMenu from './DiscussionMenu'
import { useFetchDiscussions } from '../../hooks/useFetchDiscussions'
import { useOutsideClick } from '../../hooks/useOutsideClick'
import LoadingMoreItemsSpinner from '../common/LoadingMoreItemsSpinner'

const DiscussionList: React.FC = () => {

    const [selectedUser, setSelectedUser] = useState<User | null>(null)
    const [idDiscussion, setIdDiscussion] = useState<string>('')
    const [messages, setMessages] = useState<Message[]>([])
    const [searchInDiscussion, setSearchInDiscussion] = useState<string>('')
    const [usersSearch, setUsersSearch] = useState<Discussion[]>([])
    const { setHasUnreadMessages } = useNotification()

    const [state, dispatch] = useReducer(DiscussionReducer, initialState)
    const { menuOpen, discussions, loading, loadingMoreDiscussions } = state

    const { fetchDiscussions, loadMoreDiscussions } = useFetchDiscussions(dispatch)

    const { theme } = useThemeContext()
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

    const searchUsers = async (userId: string, searchReq: string) => {
        try {
            if (user) {
                const searchRequest = { userId, searchReq }
                const response = await messageService.searchUsersByFirstNameOrLastNameOrLastMessageAsync(searchRequest, 1, 10)
                console.log(response)
                setUsersSearch(response)
            }
        } catch (error) {
            console.log('Failed to fetch users.')
        }

    }
    const handleClearSearch = () => {
        setSearchInDiscussion('')
    }
    // Debounced searchUsers function
    const debouncedSearchUsers = useCallback(
        debounce(async (userId: string, searchReq: string) => {
            if (searchReq.trim()) {
                // Call your search function
                await searchUsers(userId, searchReq)
                //setUsersSearch(results) // Update search results
            } else {
                setUsersSearch([]) // Clear results if input is empty
            }
        }, 300), []
    )

    // Handle search input change
    const handleChange = (field: 'searchInDiscussion', value: string) => {
        if (field === 'searchInDiscussion') {
            setSearchInDiscussion(value)
            if (user) {
                debouncedSearchUsers(user.id, value)
            }
        }
    }


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
                            <div className="flex items-center space-x-2">

                                {searchInDiscussion && (
                                    <ChevronLeft
                                        className='w-4 h-4 text-blue-600 cursor-pointer dark:text-gray-400 dark:hover:text-white'
                                        onClick={() => handleClearSearch()}
                                    />
                                )}
                                <div className='relative flex-grow'>
                                    <input
                                        type='text'
                                        name='searchInDiscussion'
                                        placeholder='Search'
                                        value={searchInDiscussion}
                                        onChange={(e) => handleChange('searchInDiscussion', e.target.value)}
                                        className='w-full h-7 px-2 text-sm border-b-2 bg-gray-200 border-gray-600 rounded-2xl placeholder:font-light placeholder:text-gray-500 dark:bg-gray-700 focus:border-blue-400 focus:outline-none'
                                    />
                                    <SearchIcon
                                        className='w-3 h-3 text-blue-600 absolute right-2 top-1/2 transform -translate-y-1/2 dark:text-gray-400 dark:hover:text-white'
                                    />

                                </div>
                            </div>
                            {searchInDiscussion ? (
                                usersSearch?.length > 0 ? (

                                    <div className="list-none flex flex-col space-y-2 "
                                        ref={observerRef}
                                        style={{ height: '70vh', overflowY: 'auto' }}
                                    >
                                        {usersSearch.map((discussion, index) => {

                                            const {
                                                id,
                                                lastMessage,
                                                receiver
                                            } = discussion

                                            const isMyMessage = lastMessage.senderId === user?.id

                                            const isAudioMessage = lastMessage.type === 'audio'
                                            const isFileMessage = lastMessage.type === 'file'

                                            let messageText = lastMessage.content

                                            if (isAudioMessage || isFileMessage) {
                                                messageText = isMyMessage
                                                    ? (isAudioMessage ? 'You sent a voice message.' : 'You sent a file.')
                                                    : (isAudioMessage ? 'Sent you a voice message.' : 'Sent you a file.')
                                            }

                                            const isMenuOpen = menuOpen === id
                                            return (
                                                <li
                                                    key={index}
                                                    className="flex flex-col space-y-1 p-1 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 ease-in-out group"
                                                    onClick={() => handleUserClick(receiver, id)}

                                                >
                                                    <div className="flex items-center space-x-3">
                                                        <div className="relative flex-shrink-0">
                                                            <img
                                                                // src={receiver.avatarUrl}
                                                                src={getAvatarUrl(theme, receiver ?? {})}
                                                                alt={`Avatar ${receiver.firstName}`}
                                                                className="w-6 h-6 rounded-full object-cover transition-opacity duration-300 ease-in-out hover:opacity-80"
                                                            />
                                                            <div
                                                                className={` absolute bottom-0 right-0 w-2 h-2 rounded-full border-2 border-white dark:border-gray-800 ${discussion.receiver.active ? 'bg-green-500' : 'bg-red-500'}  `}
                                                                style={{ transform: 'translate(25%, 25%)' }}
                                                            />
                                                        </div>
                                                        <div className="flex flex-col justify-center flex-grow">
                                                            <p className="font-semibold truncate text-xs text-dark dark:text-white">
                                                                {receiver.firstName} {receiver.lastName}
                                                            </p>
                                                            <div className="flex items-center space-x-2 text-xs text-black dark:text-white">
                                                                <p className={` truncate ${!lastMessage.read && !isMyMessage ? 'font-bold' : 'font-normal'} `}>
                                                                    {messageText}
                                                                </p>
                                                                <p className='truncate text-[12px]'>
                                                                    {getTimeDifference(lastMessage.timestamp)} {/* Format timestamp */}
                                                                </p>
                                                                {!lastMessage.read && !isMyMessage && (
                                                                    <div className="relative">
                                                                        <div className="absolute -top-1 -right-2 w-2 h-2 rounded-full bg-blue-500" />
                                                                    </div>
                                                                )}
                                                                {lastMessage.read && isMyMessage && (
                                                                    <CheckCheck className='w-3 h-3' />
                                                                )}
                                                            </div>
                                                        </div>
                                                        <div className="ml-auto items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                                            <CircleEllipsis className="w-4 h-4 text-gray-500 dark:text-gray-300 cursor-pointer transition-colors duration-200"
                                                                onClick={(e) => {
                                                                    e.stopPropagation()
                                                                    dispatch({ type: 'TOGGLE_MENU', payload: id })
                                                                }} />
                                                        </div>
                                                    </div>
                                                    {/* Popup Menu */}
                                                    <DiscussionMenu
                                                        idDiscussion={id}
                                                        isMenuOpen={isMenuOpen}
                                                        dispatch={dispatch}
                                                        menuRef={menuRef}

                                                    />
                                                </li>
                                            )
                                        })}
                                        {loadingMoreDiscussions && (
                                            <LoadingMoreItemsSpinner />
                                        )}

                                    </div>

                                ) : (
                                    <p className="text-gray-500 dark:text-gray-400 text-sm text-center">No users found.</p>
                                )
                            ) : (

                                <div className="list-none flex flex-col space-y-2 "
                                    ref={observerRef}
                                    style={{ height: '70vh', overflowY: 'auto' }}
                                >
                                    {discussions.map((discussion, index) => {

                                        const {
                                            id,
                                            lastMessage,
                                            receiver
                                        } = discussion

                                        const isMyMessage = lastMessage.senderId === user?.id

                                        const isAudioMessage = lastMessage.type === 'audio'
                                        const isFileMessage = lastMessage.type === 'file'

                                        let messageText = lastMessage.content

                                        if (isAudioMessage || isFileMessage) {
                                            messageText = isMyMessage
                                                ? (isAudioMessage ? 'You sent a voice message.' : 'You sent a file.')
                                                : (isAudioMessage ? 'Sent you a voice message.' : 'Sent you a file.')
                                        }

                                        const isMenuOpen = menuOpen === id
                                        return (
                                            <li
                                                key={index}
                                                className="flex flex-col space-y-1 p-1 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 ease-in-out group"
                                                onClick={() => handleUserClick(receiver, id)}

                                            >
                                                <div className="flex items-center space-x-3">
                                                    <div className="relative flex-shrink-0">
                                                        <img
                                                            // src={receiver.avatarUrl}
                                                            src={getAvatarUrl(theme, receiver ?? {})}
                                                            alt={`Avatar ${receiver.firstName}`}
                                                            className="w-6 h-6 rounded-full object-cover transition-opacity duration-300 ease-in-out hover:opacity-80"
                                                        />
                                                        <div
                                                            className={` absolute bottom-0 right-0 w-2 h-2 rounded-full border-2 border-white dark:border-gray-800 ${discussion.receiver.active ? 'bg-green-500' : 'bg-red-500'}  `}
                                                            style={{ transform: 'translate(25%, 25%)' }}
                                                        />
                                                    </div>
                                                    <div className="flex flex-col justify-center flex-grow">
                                                        <p className="font-semibold truncate text-xs text-dark dark:text-white">
                                                            {receiver.firstName} {receiver.lastName}
                                                        </p>
                                                        <div className="flex items-center space-x-2 text-xs text-black dark:text-white">
                                                            <p className={` truncate ${!lastMessage.read && !isMyMessage ? 'font-bold' : 'font-normal'} `}>
                                                                {messageText}
                                                            </p>
                                                            <p className='truncate text-[12px]'>
                                                                {getTimeDifference(lastMessage.timestamp)} {/* Format timestamp */}
                                                            </p>
                                                            {!lastMessage.read && !isMyMessage && (
                                                                <div className="relative">
                                                                    <div className="absolute -top-1 -right-2 w-2 h-2 rounded-full bg-blue-500" />
                                                                </div>
                                                            )}
                                                            {lastMessage.read && isMyMessage && (
                                                                <CheckCheck className='w-3 h-3' />
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className="ml-auto items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                                        <CircleEllipsis className="w-4 h-4 text-gray-500 dark:text-gray-300 cursor-pointer transition-colors duration-200"
                                                            onClick={(e) => {
                                                                e.stopPropagation()
                                                                dispatch({ type: 'TOGGLE_MENU', payload: id })
                                                            }} />
                                                    </div>
                                                </div>
                                                {/* Popup Menu */}
                                                <DiscussionMenu
                                                    idDiscussion={id}
                                                    isMenuOpen={isMenuOpen}
                                                    dispatch={dispatch}
                                                    menuRef={menuRef}

                                                />
                                            </li>
                                        )
                                    })}
                                    {loadingMoreDiscussions && (
                                        <LoadingMoreItemsSpinner />
                                    )}

                                </div>
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
export default DiscussionList