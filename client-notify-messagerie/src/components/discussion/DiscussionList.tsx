/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react'
import { User } from '../../interfaces'
import { CheckCheck, ChevronLeft, SearchIcon } from 'lucide-react'
import { useAuth } from '../../contexte/AuthContext'
import { Discussion, Message } from '../../interfaces/Discussion'

import messageService from '../../services/messageService'
import DiscussionSidebar from './DiscussionSidebar'
import { useThemeContext } from '../../contexte/ThemeContext'
import { getAvatarUrl, getTimeDifference } from '../../utils/userUtils'
import DiscussionListSkeleton from './DiscussionListSkeleton'
import userService from '../../services/userService'
import { useWebSocket } from '../../hooks/webSocketHook'

const DiscussionList: React.FC = () => {

    const [selectedUser, setSelectedUser] = useState<User | null>(null)
    const [discussions, setDiscussions] = useState<Discussion[]>([])
    const [idDiscussion, setIdDiscussion] = useState<string>('')
    const [messages, setMessages] = useState<Message[]>([])
    const [loading, setLoading] = useState<boolean>(true)
    const [searchInDiscussion, setSearchInDiscussion] = useState<string>('')
    const [usersSearch, setUsersSearch] = useState<User[]>([])

    const { theme } = useThemeContext()
    const { user, refreshUserData } = useAuth()

    const fetchDiscussions = async () => {
        try {
            if (user) {
                const discussionsData = await messageService.getDiscussions(user.id)
                //console.log(discussionsData)
                setDiscussions(discussionsData)
            }
        } catch (error) {
            console.log('Failed to fetch discussions')
        } finally {
            setLoading(false)
        }
    }

    const handleUserClick = async (receiver: User, idDiscussion: string) => {
        setSelectedUser(receiver)
        setIdDiscussion(idDiscussion)
        try {
            if (user) {
                const discussionData = await messageService.getDiscussion(receiver.id, user.id)
                //console.log(discussionData.messages)
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
        const timestamp = newMessage.timestamp instanceof Date ? newMessage.timestamp : new Date(newMessage.timestamp)

        setDiscussions(prevDiscussions => {
            // Update the discussions with the new message
            const updatedDiscussions = prevDiscussions.map(discussion => {
                if (discussion.id === newMessage.discussionId) {
                    return {
                        ...discussion,
                        lastMessage: newMessage,
                        lastMessageTimestamp: timestamp.toISOString(),
                        lastMessageContent: newMessage.content
                    }
                }
                return discussion
            })
            return updatedDiscussions.sort((a, b) => {
                if (a.id === newMessage.discussionId) return -1
                if (b.id === newMessage.discussionId) return 1
                return new Date(b.lastMessageTimestamp).getTime() - new Date(a.lastMessageTimestamp).getTime()
            })

        })

        setMessages(prevMessages => [...prevMessages, newMessage])
    }

    const { sendSeenNotification } = useWebSocket(user, handleNewMessage)

    const searchUsers = async (userId: string, searchReq: string) => {

        try {
            if (user) {
                const searchRequest = { userId, searchReq }
                const response = await userService.searchUsersByFirstNameOrLastName(searchRequest)
                setUsersSearch(response)
            }
        } catch (error) {
            console.log('Failed to fetch users.')
        }
        finally {
            setLoading(false)
        }

    }
    const handleChange = async (field: 'searchInDiscussion', value: string) => {
        if (field === 'searchInDiscussion') {
            setSearchInDiscussion(value)

            if (user && value.trim()) {
                searchUsers(user.id, value.trim())
            }
            if (user) {
                searchUsers(user.id, searchInDiscussion)
            } else {
                setUsersSearch([]) // Clear the results if input is empty
            }
        }
    }

    const handleClearSearch = () => {
        setSearchInDiscussion('')
    }
    useEffect(() => {
        fetchDiscussions()
    }, [user])

    return (
        <>
            {loading ? (

                <DiscussionListSkeleton />

            ) : (
                <div className="flex">
                    <div className={'fixed top-4 left-20 md:w-80 lg:w-72 flex-shrink-0 rounded-2xl bg-white dark:bg-gray-800 h-screen shadow-xl px-4 md:px-8 overflow-y-auto'}>

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
                                        autoFocus={true}
                                        className='w-full h-7 px-2 text-sm border-b-2 bg-gray-200 border-gray-600 rounded-2xl placeholder:font-light placeholder:text-gray-500 dark:bg-gray-700 focus:border-blue-400 focus:outline-none'
                                    />
                                    <SearchIcon
                                        className='w-3 h-3 text-blue-600 absolute right-2 top-1/2 transform -translate-y-1/2 dark:text-gray-400 dark:hover:text-white'
                                    />

                                </div>
                            </div>


                            {searchInDiscussion ? (

                                usersSearch?.length > 0 ? (

                                    <ul className="list-none flex flex-col space-y-2">
                                        {usersSearch.map((friend, index) => {


                                            return (
                                                <li
                                                    key={index}
                                                    className="flex flex-col space-y-1 p-2 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 ease-in-out"
                                                    onClick={() => handleUserClick(friend, friend.id)}
                                                >
                                                    <div className="flex items-center space-x-3">
                                                        <div className="relative flex-shrink-0">
                                                            <img
                                                                // src={receiver.avatarUrl}
                                                                src={getAvatarUrl(theme, friend ?? {})}
                                                                alt={`Avatar ${friend.firstName}`}
                                                                className="w-6 h-6 rounded-full object-cover transition-opacity duration-300 ease-in-out hover:opacity-80"
                                                            />
                                                        </div>
                                                        <div className="flex flex-col justify-center">
                                                            <p className="font-semibold truncate text-xs text-dark dark:text-white">
                                                                {friend.firstName} {friend.lastName}
                                                            </p>

                                                        </div>
                                                    </div>
                                                </li>
                                            )
                                        })}
                                    </ul>

                                ) : (
                                    <p className="text-gray-500 dark:text-gray-400 text-sm text-center">No users found.</p>
                                )
                            )
                                : (

                                    <ul className="list-none flex flex-col space-y-2">
                                        {discussions.map((discussion) => {

                                            const {
                                                id,
                                                lastMessage,
                                                receiver
                                            } = discussion

                                            const isMyMessage = lastMessage.senderId === user?.id

                                            const isAudioMessage = lastMessage.type === 'audio'
                                            let messageText: string
                                            if (isAudioMessage) {
                                                if (isMyMessage) {
                                                    messageText = 'You sent a voice message.'
                                                } else {
                                                    messageText = 'sent you a voice message.'
                                                }
                                            } else {
                                                messageText = lastMessage.content
                                            }
                                            return (
                                                <li
                                                    key={id}
                                                    className="flex flex-col space-y-1 p-1 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 ease-in-out"
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
                                                        <div className="flex flex-col justify-center">
                                                            <p className="font-semibold truncate text-xs text-dark dark:text-white">
                                                                {receiver.firstName} {receiver.lastName}
                                                            </p>
                                                            <div className="flex items-center space-x-2 text-xs text-black dark:text-white">
                                                                <p className={` truncate ${!lastMessage.read && !isMyMessage ? 'font-bold' : 'font-normal'} `}>
                                                                    {messageText}
                                                                </p>
                                                                <p className='text-[12px]'>
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
                                                    </div>
                                                </li>
                                            )
                                        })}
                                    </ul>

                                )}


                        </div>
                    </div>
                    {selectedUser && (
                        <div className="fixed bottom-4 top-4 left-96 rounded-2xl bg-white dark:bg-gray-800 h-screen shadow-xl w-48 md:w-56 lg:w-7/12 xl:w-3/5"
                        >
                            <DiscussionSidebar
                                receiver={selectedUser}
                                idDiscussion={idDiscussion}
                                messages={messages}
                                onMessageSent={handleNewMessage}

                            />
                        </div>

                    )}
                </div>

            )}

        </>
    )


}
export default DiscussionList