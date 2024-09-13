import React from 'react'
import { User } from '../../interfaces'
import { Message, SeenNotif } from '../../interfaces/Discussion'
import { Loader, LockKeyholeIcon } from 'lucide-react'
import { formatDateTime, getAvatarUrl } from '../../utils/userUtils'
import LoadingMoreItemsSpinner from '../common/LoadingMoreItemsSpinner'
import { useThemeContext } from '../../contexte/ThemeContext'

interface MainContentProps {
    receiver: User;
    user: User | null;
    messages: Message[];
    lastMessage: Message;
    typingUser: string | null;
    seenUser: boolean | null;
    seenNotif: SeenNotif;
    loadingMore: boolean;
    loading: boolean;
    imagePreview: string | null;
    handleScroll: React.UIEventHandler<HTMLDivElement>;
    messagesEndRef: React.RefObject<HTMLDivElement>;
}

const MainContent: React.FC<MainContentProps> = ({
    receiver,
    user,
    messages,
    lastMessage,
    typingUser,
    seenUser,
    seenNotif,
    loadingMore,
    loading,
    imagePreview,
    handleScroll,
    messagesEndRef
}) => {

    const { theme } = useThemeContext()

    return (
        <div className="flex flex-col h-[calc(100vh-6rem)]">
            <div
                className="flex flex-col flex-grow p-5"
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

                        {msg === lastMessage && user?.id === lastMessage.senderId ? (
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

                        {msg === lastMessage && typingUser && (
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
                <div ref={messagesEndRef} />
            </div>
        </div>
    )
}

export default MainContent
