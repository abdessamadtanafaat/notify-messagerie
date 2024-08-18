import React, { useEffect, useRef, useState } from 'react'
import { User } from '../../interfaces'
import { CircleEllipsis, FileIcon, ImageIcon, LockKeyholeIcon, Mic, Phone, SendIcon, Smile, Video } from 'lucide-react'
import StatusMessage from '../common/StatusMessage'
import { convertKeysToCamelCase, formatDateTime, getAvatarUrl, getTimeDifference } from '../../utils/userUtils'
import { useThemeContext } from '../../contexte/ThemeContext'
import data, { Emoji } from '@emoji-mart/data'
import Picker from '@emoji-mart/react'
import { DiscussionHandler } from './DiscussionHandler'
import { Message } from '../../interfaces/Discussion'
import messageService from '../../services/messageService'
import { useAuth } from '../../contexte/AuthContext'
import DiscussionSidebarSkeleton from './DiscussionSidebarSkeleton'


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


    // Function to fetch messages
    const fetchMessages = async () => {
        try {
            if (user) {
                const discussionData = await messageService.getDiscussion(receiver.id, user.id)
                console.log(discussionData.messages)
                setMessages(discussionData.messages)
            }
        } catch (error) {
            console.log('Failed to fetch messages')
        } finally {
            setLoading(false)
        }
    }



    // Log the messages to verify
    useEffect(() => {
        console.log('Messages updated:', messages)
    }, [messages])  // This will log messages whenever they are updated


    // useEffect to fetch messages when necessary
    useEffect(() => {
        fetchMessages()
    }, [idDiscussion, user, receiver.id]) // Only depend on idDiscussion, user, and receiver.id

    // Handle new messages (consider moving this to a WebSocket handler in real-world applications)
    const handleNewMessage = (message: Message) => {
        console.log('Received raw message:', message)

        const camelCaseMessage = convertKeysToCamelCase(message)

        console.log('Updating state with new message:', camelCaseMessage)

        setMessages((prevMessages) => [...prevMessages, camelCaseMessage])

        if (onMessageSent) {
            onMessageSent(camelCaseMessage)
        }

    }

    const [isExpanded, setIsExpanded] = useState(false)
    const toggleSidebar = () => setIsExpanded(!isExpanded)
    const { theme } = useThemeContext()
    const lastMessage = messages[messages.length - 1]

    useEffect(() => {
        scrollToBottom()
    }, [messages])


    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
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
                        // typingUser,
                    }) => (
                        <>
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
                                            <StatusMessage user={receiver} />
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
                                <div className="flex flex-col flex-grow overflow-y-auto p-3">
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
                                    <div className="flex flex-col items-center mt-4 space-y-1">
                                        <LockKeyholeIcon className="h-3 w-3 text-gray-600 dark:text-gray-400" />
                                        <p className="text-gray-600 dark:text-gray-400 text-[12px] text-center">
                                            Messages and calls are secure with end-to-end encryption.
                                        </p>
                                    </div>

                                    {/* Messages */}
                                    {messages.map((msg, index) => (
                                        <div
                                            key={index}
                                            className={`relative flex flex-col ${msg.receiverId === user?.id ? 'items-end' : 'items-start'} ${index === messages.length - 1 ? 'mb-20' : 'mb-4'}`}
                                        >
                                            <div
                                                className={`relative max-w-xs p-2 text-[14px] rounded-xl ${msg.receiverId === user?.id
                                                    ? 'bg-blue-500 text-white'
                                                    : 'bg-gray-300 text-black'
                                                    }`}
                                            >
                                                <div className="relative group">
                                                    <p className="whitespace-nowrap overflow-hidden text-ellipsis">{msg.content}</p>

                                                    <span
                                                        className="absolute left-1/2 transform -translate-x-1/2 bottom-full mb-2 p-1 bg-black text-white text-[8px] rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap overflow-hidden text-ellipsis group-hover:delay-200"
                                                        style={{ minWidth: '60px' }}
                                                    >
                                                        {formatDateTime(msg.timestamp)}
                                                    </span>
                                                </div>
                                            </div>
                                            {msg === lastMessage && !msg.read && user?.id === msg.senderId && (
                                                <p className="text-gray-500 text-[9px] mt-1 ml-1">
                                                    Sent
                                                </p>
                                            )}

                                            {msg === lastMessage && msg.read && user?.id === msg.senderId &&(
                                                <p className="text-gray-500 text-[9px] mt-1 ml-1">
                                                  Seen {getTimeDifference(msg.readTime)}

                                                </p>
                                            )}

                                        </div>
                                    ))}
                                    <div ref={messagesEndRef} />
                                </div>
                            </div>

                            {/* Input Area */}
                            <div className='absolute h-24 bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700'>
                                <div className='flex items-center justify-center space-x-1 mt-4'>
                                    <div className='flex items-center space-x-1 px-1'>
                                        <label className="relative p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer flex items-center justify-center">
                                            <input
                                                type="file"
                                                name="image"
                                                onChange={sendImage}
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
                                            onChange={(e) => handleChange('message', e.target.value)}
                                            onKeyDown={(e) => handleKeyDown(e, receiver, idDiscussion)}
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
                                        <button className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
                                            <Mic className='w-4 h-4 text-blue-600 cursor-pointer dark:text-gray-400 dark:hover:text-white' />
                                        </button>
                                        <button
                                            onClick={() => handleSend(receiver, idDiscussion)}
                                            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
                                            <SendIcon className='w-4 h-4 text-blue-600 cursor-pointer dark:text-gray-400 dark:hover:text-white' />
                                        </button>
                                    </div>
                                </div>
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
