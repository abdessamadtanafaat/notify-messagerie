/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { User } from '../../interfaces'
import { CircleEllipsis, FileIcon, ImageIcon, Loader, LockKeyholeIcon, Phone, SendIcon, Smile, Video } from 'lucide-react'
import StatusMessage from '../common/StatusMessage'
import { convertKeysToCamelCase, formatDateTime, getAvatarUrl } from '../../utils/userUtils'
import { useThemeContext } from '../../contexte/ThemeContext'
import data, { Emoji } from '@emoji-mart/data'
import Picker from '@emoji-mart/react'
import { DiscussionHandler } from './DiscussionHandler'
import { Message } from '../../interfaces/Discussion'
import messageService from '../../services/messageService'
import { useAuth } from '../../contexte/AuthContext'
import DiscussionSidebarSkeleton from './DiscussionSidebarSkeleton'
import AudioRecorder from './AudioRecorder'
import FriendInfoSidebar from '../personnes/FriendInfoSidebar'


interface DiscussionSidebarProps {
    receiver: User
    idDiscussion: string
    messages: Message[]
    onMessageSent?: (message: Message) => void;
}

const DiscussionSidebar: React.FC<DiscussionSidebarProps> = ({ receiver, idDiscussion, onMessageSent }) => {
    const { user } = useAuth()
    const [messages, setMessages] = useState<Message[]>([])
    const messagesEndRef = useRef<HTMLDivElement>(null)
    const [loading, setLoading] = useState<boolean>(true)

    const [sidebarOpen, setSidebarOpen] = useState(false)
    const toggleSidebar = () => { setSidebarOpen(prevState => !prevState) }
    const { theme } = useThemeContext()

    const lastMessage = messages[messages.length - 1]


    const [cursor, setCursor] = useState<Date | null>(null)
    const [hasMore, setHasMore] = useState<boolean>(true)
    const [scrollTop, setScrollTop] = useState<number>(0)


    const fetchMessages = useCallback(async (cursor?: Date | null) => {
        try {
            if (user) {
                //const currentScrollTop = messagesEndRef.current ? messagesEndRef.current.scrollTop : 0
                const discussionData = await messageService.getDiscussion(receiver.id, user.id, cursor ?? undefined)
                const newMessages = discussionData.messages

                setMessages(prevMessages => {
                    const existingMessageIds = new Set(prevMessages.map(msg => msg.id))
                    const filteredMessages = newMessages.filter(msg => !existingMessageIds.has(msg.id))
                    const updatedMessages = [...filteredMessages, ...prevMessages]
                    return updatedMessages.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
                    //return [...filteredMessages, ...prevMessages]
                })

                setCursor(newMessages.length > 0 ? new Date(newMessages[0].timestamp) : null)
                setHasMore(newMessages.length > 0)


            }
        } catch (error) {
            console.log('Failed to fetch messages:', error)
        } finally {
            setLoading(false)
        }
    }, [user, receiver])

    const handleNewMessage = (message: Message) => {
        setMessages(prevMessages => {
            const updatedMessages = [...prevMessages, convertKeysToCamelCase(message)]
            return updatedMessages.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
        })
        if (onMessageSent) {
            onMessageSent(message)
        }
    }

    const handleScroll = (e: React.UIEvent<HTMLDivElement, UIEvent>) => {
        const container = e.currentTarget
        const scrollTop = e.currentTarget.scrollTop

        setScrollTop(scrollTop)
        const top = scrollTop === 0
        if (top && hasMore && !loading) {
            fetchMessages(cursor || undefined)
        }
        if (top) {
            container.scrollTop = 200
        }
    }

    useEffect(() => {
        fetchMessages()
    }, [idDiscussion, user, receiver.id, onMessageSent])

    const scrollToBottomInput = () => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight
        }
    }
    return (
        <>
            {loading ? (
                <DiscussionSidebarSkeleton />
            ) : (
                <DiscussionHandler
                    render={({
                        handleChange,
                        message,
                        showEmojiPicker,
                        togglePicker,
                        addEmoji,
                        setPickerRef,
                        sendImage,
                        sendFile,
                        handleSend,
                        handleKeyDown,
                        sendTypingNotification,
                        typingUser,
                        seenUser,
                        sendSeenNotification,
                        seenNotif,
                        handleSendAudio,
                        recordingAudio,
                        sendRecordingNotification,
                        loading,
                        fileInputRef,
                        imagePreview,
                    }) => (
                        <>
                            <div className={`transition-all duration-300 ${sidebarOpen ? 'w-[calc(100%-300px)]' : 'w-full'} relative`}>
                                {/* Header Rectangle */}
                                <div className="w-full h-12 bg-white dark:bg-gray-800 rounded-lg mt-2 shadow-md">
                                    <div className="flex items-center justify-between px-5">
                                        <div className="relative flex items-center space-x-4">
                                            <div className="relative flex-shrink-0">
                                                <img
                                                    src={getAvatarUrl(theme, receiver ?? {})}
                                                    alt="Avatar user"
                                                    className="w-24 h-24 md:w-8 md:h-8 rounded-full object-cover border-2 border-gray-300 dark:border-gray-700"
                                                />
                                                <div
                                                    className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white dark:border-gray-800 ${receiver.active ? 'bg-green-500' : 'bg-red-500'}`}
                                                    style={{ transform: 'translate(25%, 25%)' }}
                                                />
                                            </div>
                                            <div className="flex flex-col text-xs">
                                                <p className="font-bold truncate text-dark dark:text-white text-xs">{receiver.firstName} {receiver.lastName}</p>
                                                {typingUser ? (
                                                    <p className="font-normal truncate text-dark text-green-600 dark:text-light-blue-600 text-xs" >Is typing...</p>
                                                ) : recordingAudio ? (
                                                    <p className="font-normal truncate text-green-600 dark:text-light-blue-600 text-xs" >Is Recording...</p>) : (
                                                    <StatusMessage user={receiver} />
                                                )}

                                            </div>
                                        </div>
                                        <div className="flex space-x-2">
                                            <button className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
                                                <Video className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                                            </button>
                                            <button className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
                                                <Phone className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                                            </button>
                                            <button onClick={toggleSidebar} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
                                                <CircleEllipsis className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Main Content */}
                                <div className="flex flex-col h-[calc(100vh-6rem)]">
                                    <div className="flex flex-col flex-grow p-5"
                                        onScroll={handleScroll}
                                        style={{
                                            height: '100%',
                                            overflowY: 'auto',
                                            overflowX: 'hidden',
                                            paddingTop: '50px',
                                            paddingBottom: '6rem',
                                            position: 'relative'
                                        }}
                                        ref={messagesEndRef}
                                    >
                                        {/* Avatar */}
                                        <div className="flex flex-col items-center space-y-1">
                                            <img
                                                src={getAvatarUrl(theme, receiver ?? {})}
                                                alt="Avatar user"
                                                className="w-24 h-24 md:w-16 md:h-16 rounded-full object-cover border-2 border-gray-300 dark:border-gray-700"
                                            />
                                            <p className="font-extrabold text-dark dark:text-white text-sm">{receiver.firstName} {receiver.lastName}</p>
                                            <p className="text-gray-600 dark:text-gray-400 text-xs text-left">
                                                You are friends on NotifyAsServie
                                            </p>
                                        </div>

                                        {/* Security Area */}
                                        <div className="flex items-center justify-center mt-4 space-x-2 mb-7">
                                            <LockKeyholeIcon className="h-3 w-3 text-gray-600 dark:text-gray-400" />
                                            <p className="text-gray-600 dark:text-gray-400 text-[12px]">
                                                Messages and calls are secure with end-to-end encryption.
                                            </p>
                                        </div>

                                        {/* Messages */}
                                        {[...messages].map((msg, index) => (
                                            <div
                                                key={msg.id === 'draft' ? 'draft' : index}
                                                className={`relative flex flex-col ${msg.receiverId === user?.id ? 'items-start' : 'items-end'} ${index === messages.length ? 'mb-20' : 'mb-5'}`}
                                            >
                                                <div
                                                    className={`relative max-w-xs p-2 text-[14px] rounded-xl ${msg.receiverId === user?.id
                                                        ? 'bg-gray-300 text-black'
                                                        : 'bg-blue-500 text-white'

                                                        }`}
                                                >
                                                    <div className="relative group">
                                                        {msg.type === 'message' && (
                                                            <p className="whitespace-nowrap overflow-hidden text-ellipsis">{msg.content}</p>
                                                        )}

                                                        {msg.type === 'audio' && (
                                                            <audio
                                                                className="whitespace-nowrap overflow-hidden text-ellipsis"
                                                                controls>
                                                                <source src={msg.content} type="audio/wav" />
                                                                Your browser does not support the audio element.
                                                            </audio>
                                                        )}

                                                        {msg.type === 'file' && (
                                                            <img
                                                                className="whitespace-nowrap overflow-hidden text-ellipsis"
                                                                src={msg.content} />
                                                        )}
                                                        <span
                                                            className="absolute left-1/2 transform -translate-x-1/2 bottom-full mb-2 p-1 bg-black text-white text-[8px] rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap overflow-hidden text-ellipsis group-hover:delay-200"
                                                            style={{ minWidth: '60px' }}
                                                        >
                                                            {formatDateTime(msg.timestamp)}
                                                        </span>
                                                    </div>
                                                </div>

                                                {msg === lastMessage && user?.id === lastMessage.senderId ? (
                                                    seenUser ? (
                                                        <p className="text-gray-500 text-[9px] mt-1 ml-1">
                                                            Seen {formatDateTime(seenNotif.seenDate)}
                                                        </p>
                                                    ) : (
                                                        lastMessage.read ? (
                                                            <p className="text-gray-500 text-[9px] mt-1 ml-1">
                                                                {formatDateTime(lastMessage.timestamp)}
                                                            </p>
                                                        ) : (
                                                            <p className="text-gray-500 text-[9px] mt-1 ml-1">
                                                                Sent
                                                            </p>
                                                        )
                                                    )
                                                ) : null}

                                                {msg === lastMessage && typingUser &&
                                                    <div className="typing mt-4">
                                                        <div className="typing__dot"></div>
                                                        <div className="typing__dot"></div>
                                                        <div className="typing__dot"></div>
                                                    </div>
                                                }


                                            </div>
                                        ))}

                                        {loading && imagePreview && (
                                            <div className="relative w-32 h-32">
                                                <img
                                                    src={imagePreview}
                                                    alt="loading"
                                                    className="w-full h-full object-cover"
                                                />
                                                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                                                    <Loader className='w-8 h-8 text-blue-600 dark:text-white animate-spin' />
                                                    <p className="ml-2 text-white">Sending...</p>
                                                </div>
                                            </div>
                                        )}
                                        <div ref={messagesEndRef} />
                                    </div>
                                </div>

                                {/* Input Area */}
                                <div className='absolute bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700'>
                                    <div className='flex items-center justify-center space-x-1'>
                                        <div className='flex items-center space-x-1 px-1'>
                                            <label className="relative p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer flex items-center justify-center">
                                                <input
                                                    type="file"
                                                    name="image"
                                                    onChange={(e) => sendImage(e, idDiscussion, receiver)}
                                                    ref={fileInputRef}
                                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                                />

                                                <ImageIcon className='w-4 h-4 text-blue-600 dark:text-gray-400 dark:hover:text-white' />
                                            </label>
                                            <label className="relative p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer flex items-center justify-center">
                                                <input
                                                    type="file"
                                                    name="image"
                                                    onChange={sendFile}
                                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                                />
                                                <FileIcon className='w-4 h-4 text-blue-600 cursor-pointer dark:text-gray-400 dark:hover:text-white' />
                                            </label>
                                        </div>

                                        <div className='relative flex-grow'>
                                            <input
                                                type='text'
                                                name='message'
                                                placeholder='Type a message...'
                                                value={message}
                                                onChange={(e) => {
                                                    handleChange('message', e.target.value)
                                                    sendTypingNotification(lastMessage.discussionId, receiver)
                                                    scrollToBottomInput()
                                                }}
                                                onKeyDown={(e) => {
                                                    handleKeyDown(e, receiver, idDiscussion)
                                                    scrollToBottomInput()
                                                }}
                                                onFocus={() => {
                                                    if (user?.id === lastMessage.receiverId) {
                                                        sendSeenNotification(lastMessage.id, lastMessage.discussionId, receiver)
                                                    }
                                                    scrollToBottomInput()
                                                }}
                                                autoFocus={true}
                                                className='w-full h-10 px-2 text-sm border-b-2 bg-gray-200 border-gray-600 rounded-2xl placeholder:font-light placeholder:text-gray-500 dark:bg-gray-700 focus:border-blue-400 focus:outline-none'
                                            />

                                            <Smile
                                                className='w-4 h-4 text-blue-600 cursor-pointer absolute right-2 top-1/2 transform -translate-y-1/2 dark:text-gray-400 dark:hover:text-white'
                                                onClick={() => togglePicker('message')}
                                            />
                                            {showEmojiPicker.message && (
                                                <div
                                                    ref={setPickerRef('message')}
                                                    className="absolute transform -translate-y-96 right-1 bg-white border border-gray-300 rounded shadow-lg"
                                                >
                                                    <Picker
                                                        data={data}
                                                        emojiSize={20}
                                                        emojiButtonSize={28}
                                                        onEmojiSelect={(emoji: Emoji) => addEmoji(emoji)}
                                                        maxFrequentRows={0}
                                                    />
                                                </div>
                                            )}
                                        </div>

                                        <div className='flex items-center space-x-1 px-1'>
                                            <AudioRecorder
                                                onSend={async (blob) => handleSendAudio(blob, idDiscussion, receiver)}
                                                sendRecordingNotification={(discussionId, receiver) => sendRecordingNotification(discussionId, receiver)}
                                                lastMessage={lastMessage}
                                                receiver={receiver}
                                            />

                                            <button
                                                onClick={() => handleSend(receiver, idDiscussion)}
                                                className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
                                                <SendIcon className='w-4 h-4 text-blue-600 cursor-pointer dark:text-gray-400 dark:hover:text-white' />
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Friend Info Sidebar */}
                                {sidebarOpen && (
                                    <div className="w-1/3 min-w-[300px] border-l border-gray-300 dark:border-gray-700">
                                        <FriendInfoSidebar
                                            user={receiver} />
                                    </div>
                                )}
                            </div>

                        </>
                    )}
                    onNewMessage={handleNewMessage}
                />

            )}
        </>


    )
}

export default DiscussionSidebar
