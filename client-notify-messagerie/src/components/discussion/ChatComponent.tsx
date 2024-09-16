import React, { useEffect, useRef, useState } from 'react'
import { User } from '../../interfaces'
import { SeenNotif } from '../../interfaces/Discussion'
import { FileIcon, ImageIcon, Loader, LockKeyholeIcon, SendIcon, Smile } from 'lucide-react'
import { formatDateTime, getAvatarUrl } from '../../utils/userUtils'
import LoadingMoreItemsSpinner from '../common/LoadingMoreItemsSpinner'
import { useThemeContext } from '../../contexte/ThemeContext'
import { useAuth } from '../../contexte/AuthContext'
import useFetchMessages from './useFetchMessages'
import handleScroll from './handleScrollTop'
import { DiscussionHandler } from './DiscussionHandler'
import AudioRecorder from './AudioRecorder'
import data, { Emoji } from '@emoji-mart/data'
import Picker from '@emoji-mart/react'

interface ChatComponentProps {
    receiver: User;
    typingUser: string | null;
    seenUser: boolean | null;
    seenNotif: SeenNotif;
    idDiscussion: string;
}

const ChatComponent: React.FC<ChatComponentProps> = ({
    receiver,typingUser,seenUser,seenNotif,idDiscussion
}) => {

    const { theme } = useThemeContext()
    const { user } = useAuth()
    const [scrollTop, setScrollTop] = useState<number>(0)
    const { messages, loadingMore, fetchMessages, cursor, hasMore } = useFetchMessages({ user, receiver, idDiscussion })
    const handleScrollEvent = handleScroll({ fetchMessages, cursor, hasMore, loadingMore, setScrollTop })


    // const messagesEndRef = useRef<HTMLDivElement | null>(null)
    
    // useEffect(() => {
    //     if (messagesEndRef.current) {
    //         messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    //     }
    // }, [messages])
    
    
    useEffect(() => {
        fetchMessages()
    }, [fetchMessages])


    return (
        <DiscussionHandler
            render={({ imagePreview, loading, handleChange, showEmojiPicker, togglePicker, addEmoji, setPickerRef,
                sendImage, sendFile,handleSend, handleKeyDown, sendTypingNotification, sendSeenNotification,
                handleSendAudio, sendRecordingNotification, fileInputRef, message
            }) => (
            <>
                    <>
                    <div className="flex flex-col h-[calc(100vh-6rem)]">
                        <div
                            className="flex flex-col flex-grow p-5"
                            onScroll={handleScrollEvent}
                            style={{
                                height: '100%',
                                overflowY: 'auto',
                                overflowX: 'hidden',
                                paddingTop: '50px',
                                paddingBottom: '6rem',
                                position: 'relative'
                            }}
                        >
                            {/* Avatar */}
                            <div className="flex flex-col items-center space-y-1">
                                <img
                                    src={getAvatarUrl(theme, receiver ?? {})}
                                    alt="Avatar user"
                                    className="w-24 h-24 md:w-16 md:h-16 rounded-full object-cover border-2 border-gray-300 dark:border-gray-700"
                                />
                                <p className="font-extrabold text-dark dark:text-white text-sm">
                                    {receiver.firstName} {receiver.lastName}
                                </p>
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

                            {loadingMore && (
                                <div>
                                    <LoadingMoreItemsSpinner />
                                </div>
                            )}

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
                                                <audio className="whitespace-nowrap overflow-hidden text-ellipsis" controls>
                                                    <source src={msg.content} type="audio/wav" />
                                                    Your browser does not support the audio element.
                                                </audio>
                                            )}

                                            {msg.type === 'file' && (
                                                <img className="whitespace-nowrap overflow-hidden text-ellipsis" src={msg.content} />
                                            )}
                                            <span
                                                className="absolute left-1/2 transform -translate-x-1/2 bottom-full mb-2 p-1 bg-black text-white text-[8px] rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap overflow-hidden text-ellipsis group-hover:delay-200"
                                                style={{ minWidth: '60px' }}
                                            >
                                                {formatDateTime(msg.timestamp)}
                                            </span>
                                        </div>
                                    </div>

                                    {messages.length > 0 && msg === messages[messages.length - 1] && user?.id === messages[messages.length - 1].senderId ? (
                                        seenUser ? (
                                            seenNotif.seenDate ? (
                                                <p className="text-gray-500 text-[9px] mt-1 ml-1">
                                                    Seen {formatDateTime(seenNotif.seenDate)}
                                                </p>
                                            ) : (
                                                <p className="text-gray-500 text-[9px] mt-1 ml-1">
                                                    Seen
                                                </p>
                                            )
                                        ) : (
                                            messages[messages.length - 1].read ? (
                                                <p className="text-gray-500 text-[9px] mt-1 ml-1">
                                                    {formatDateTime(messages[messages.length - 1].timestamp)}
                                                </p>
                                            ) : (
                                                <p className="text-gray-500 text-[9px] mt-1 ml-1">
                                                    Sent
                                                </p>
                                            )
                                        )
                                    ) : null}

                                    {messages.length > 0 && msg === messages[messages.length - 1] && typingUser && (
                                        <div className="typing mt-4">
                                            <div className="typing__dot"></div>
                                            <div className="typing__dot"></div>
                                            <div className="typing__dot"></div>
                                        </div>
                                    )}

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
                            {/* <div ref={messagesEndRef} /> */}

                        </div>
                    </div>

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
                                        name="file"
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
                                        sendTypingNotification(idDiscussion, receiver)
                                    }}
                                    onKeyDown={(e) => {
                                        handleKeyDown(e, receiver, idDiscussion)
                                    }}
                                    onFocus={() => {
                                        if (receiver.id === receiver.id) {
                                            sendSeenNotification(messages[messages.length - 1].id, idDiscussion, receiver)
                                        }
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
                                    sendRecordingNotification={sendRecordingNotification}
                                    receiver={receiver}
                                    discussionId={idDiscussion}
                                />
                                <button
                                    onClick={() => handleSend(receiver, idDiscussion)}
                                    className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
                                    <SendIcon className='w-4 h-4 text-blue-600 cursor-pointer dark:text-gray-400 dark:hover:text-white' />
                                </button>
                            </div>
                        </div>
                    </div>
                    </>
            </>
    
            )}
        />
    )
}

export default ChatComponent
