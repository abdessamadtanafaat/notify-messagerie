import React, { useState } from 'react'
import { CheckCheck, CircleEllipsis, MinusCircle, Pin } from 'lucide-react'
import DiscussionMenu from './DiscussionMenu'
import LoadingMoreItemsSpinner from '../common/LoadingMoreItemsSpinner'
import { useThemeContext } from '../../contexte/ThemeContext'
import { useAuth } from '../../contexte/AuthContext'
import useDiscussionListHandler from './useDiscussionListHandler' // Import the new hook
import { User } from '../../interfaces'
import defaultAvatar from '../../assets/default-avatar.png' // Import the default avatar image


interface DiscussionListProps {
    userId: string;
    handleUserClick: (receiver: User, idDiscussion: string) => void;
}

const DiscussionList: React.FC<DiscussionListProps> = ({ userId, handleUserClick }) => {
    const {
        observerRef,
        loading,
        menuOpen,
        discussions,
        loadingMoreDiscussions,
        dispatch,
        menuRef,
        getAvatarUrl,
        getTimeDifference,
    } = useDiscussionListHandler({ userId, handleUserClick })


    const { theme } = useThemeContext()
    const { user } = useAuth()

    const [IsmenuOpen, setMenuOpen] = useState<string | null>(null)


    const toggleMenu = (id: string, e: React.MouseEvent) => {
        e.stopPropagation() 
        const newMenuState = IsmenuOpen === id ? null : id
        dispatch({ type: 'TOGGLE_MENU', payload: newMenuState })
        setMenuOpen(prevMenuOpen => (prevMenuOpen === id ? null : id))
    }
    
    return (
        <div
            className="list-none flex flex-col space-y-2"
            ref={observerRef}
            style={{ height: '70vh', overflowY: 'auto' }}
        >
            {loading ? (
                <LoadingMoreItemsSpinner />
            ) : (
                discussions.map((discussion, index) => {
                    const { id, lastMessage, receiver, isPinned, isBlocked} = discussion
                    const isMyMessage = lastMessage.senderId === user?.id
                    const isAudioMessage = lastMessage.type === 'audio'
                    const isFileMessage = lastMessage.type === 'file'

                    let messageText = lastMessage.content

                    if (isAudioMessage || isFileMessage) {
                        messageText = isMyMessage
                            ? isAudioMessage
                                ? 'You sent a voice message.'
                                : 'You sent a file.'
                            : isAudioMessage
                                ? 'Sent you a voice message.'
                                : 'Sent you a file.'
                    }

                    const isMenuOpen = menuOpen === id

                    
                    return (
                        <li
                            key={index}
                            className={`flex flex-col space-y-1 p-1 rounded-lg cursor-pointer transition-colors duration-200 ease-in-out group ${
                                !lastMessage.read && !isMyMessage ? 'bg-gray-100 dark:bg-gray-700' : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                            }`}
                            onClick={() => handleUserClick(receiver, id)}
                        >
                            <div className="flex items-center space-x-3">
                                <div className="relative flex-shrink-0">
                                <img
                                        src={isBlocked ? defaultAvatar : getAvatarUrl(theme, receiver ?? {})}
                                        alt={`Avatar ${receiver.firstName}`}
                                        className="w-6 h-6 rounded-full object-cover transition-opacity duration-300 ease-in-out hover:opacity-80"
                                    />
                                    { !isBlocked && (
                                    <div
                                        className={`absolute bottom-0 right-0 w-2 h-2 rounded-full border-2 border-white dark:border-gray-800 ${discussion.receiver.active ? 'bg-green-500' : 'bg-red-500'
                                            }`}
                                        style={{ transform: 'translate(25%, 25%)' }}
                                    />
                                )}

                                </div>
                                <div className="flex flex-col justify-center flex-grow">
                                {isBlocked ? (
                                        <p className="font-normal text-xs text-dark dark:text-white">
                                            Messagerie user
                                        </p>
                                    ) : (
                                        <p className="font-semibold truncate text-xs text-dark dark:text-white">
                                            {receiver.firstName} {receiver.lastName}
                                        </p>
                                )}

                                    {!isBlocked && (
                                        <div className="flex items-center space-x-2 text-xs text-black dark:text-white">
                                            <p
                                                className={`truncate ${!lastMessage.read && !isMyMessage ? 'font-bold' : 'font-normal'
                                                    }`}
                                            >
                                                {messageText}
                                            </p>
                                            <p className="truncate text-[12px]">
                                                {getTimeDifference(lastMessage.timestamp)}
                                            </p>
                                            {!lastMessage.read && !isMyMessage && (
                                                <div className="relative">
                                                    <div className="absolute -top-1 -right-2 w-2 h-2 rounded-full bg-blue-500" />
                                                </div>
                                            )}
                                            {lastMessage.read && isMyMessage && <CheckCheck className="w-3 h-3" />}
                                        </div>
                                    )}

                                </div>
                                
                                {isPinned && (<Pin className="h-3.5 w-3.5 text-green-700 dark:text-green-800" />)}
                                {isBlocked && (<MinusCircle className="h-3.5 w-3.5 text-red-700 dark:text-red-800" />)}

                                <div className="ml-auto items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <CircleEllipsis
                                        className="w-4 h-4 text-gray-500 dark:text-gray-300 cursor-pointer transition-colors duration-200"
                                        onClick={(e) => toggleMenu(id, e)} 

                                    />
                                </div>
                            </div>
                            <DiscussionMenu
                                idDiscussion={id}
                                isMenuOpen={isMenuOpen}
                                dispatch={dispatch}
                                menuRef={menuRef}
                                isPinned={isPinned}
                                isBlocked={isBlocked}

                            />
                        </li>
                    )
                })
            )}
            {loadingMoreDiscussions && <LoadingMoreItemsSpinner />}
        </div>
    )
}

export default DiscussionList
