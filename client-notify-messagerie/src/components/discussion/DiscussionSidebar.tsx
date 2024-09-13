/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useReducer, useRef, useState } from 'react'
import { User } from '../../interfaces'
import { DiscussionHandler } from './DiscussionHandler'
import { Message } from '../../interfaces/Discussion'
import { useAuth } from '../../contexte/AuthContext'
import DiscussionSidebarSkeleton from './DiscussionSidebarSkeleton'
import FriendInfoSidebar from '../personnes/FriendInfoSidebar'
import { DiscussionReducer, initialState } from './DiscussionReducer'
import HeaderDiscussion from './HeaderDiscussion'
import InputArea from './InputArea'
import MainContent from './MainContent'
import useFetchMessages from './useFetchMessages'
import handleNewMessage from './handleNewMessage'
import handleScroll from './handleScrollTop'


interface DiscussionSidebarProps {
    receiver: User
    idDiscussion: string
    messages: Message[]
    onMessageSent?: (message: Message) => void;
}

const DiscussionSidebar: React.FC<DiscussionSidebarProps> = ({ receiver, idDiscussion, onMessageSent }) => {
    const { user } = useAuth()
    const messagesEndRef = useRef<HTMLDivElement>(null)
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [messages, setMessages] = useState<Message[]>([])
    const toggleSidebar = () => { setSidebarOpen(prevState => !prevState) }
    const [scrollTop, setScrollTop] = useState<number>(0)
    const [state, dispatch] = useReducer(DiscussionReducer, initialState)
    const { messages: fetchedMessages, loading, loadingMore, fetchMessages, cursor, hasMore } = useFetchMessages({ user, receiver, idDiscussion })
    const lastMessage = messages[messages.length - 1]


    // Pass dispatch to handleNewMessage
    const handleNew = handleNewMessage({ setMessages, dispatch, onMessageSent })
    const handleScrollEvent = handleScroll({ fetchMessages, cursor, hasMore, loadingMore, setScrollTop })

    useEffect(() => {
        fetchMessages()
    }, [fetchMessages])

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
                        handleChange, message, showEmojiPicker, togglePicker, addEmoji, setPickerRef, sendImage, sendFile,
                        handleSend, handleKeyDown, sendTypingNotification, typingUser, seenUser, sendSeenNotification,
                        seenNotif, handleSendAudio, recordingAudio, sendRecordingNotification, loading, fileInputRef,
                        imagePreview,
                    }) => (
                        <>
                            <div className={`transition-all duration-300 ${sidebarOpen ? 'w-[calc(100%-300px)]' : 'w-full'} relative`}>

                                <HeaderDiscussion
                                    receiver={receiver}
                                    toggleSidebar={toggleSidebar}
                                    typingUser={typingUser}
                                    recordingAudio={recordingAudio}
                                />
                                <MainContent
                                    receiver={receiver}
                                    user={user}
                                    messages={fetchedMessages}
                                    lastMessage={lastMessage}
                                    typingUser={typingUser}
                                    seenUser={seenUser}
                                    seenNotif={seenNotif}
                                    loadingMore={loadingMore}
                                    loading={loading}
                                    imagePreview={imagePreview}
                                    handleScroll={handleScrollEvent}
                                    messagesEndRef={messagesEndRef}
                                />

                                <InputArea
                                    message={message}
                                    handleChange={handleChange}
                                    showEmojiPicker={showEmojiPicker}
                                    togglePicker={togglePicker}
                                    addEmoji={addEmoji}
                                    setPickerRef={setPickerRef}
                                    sendImage={sendImage}
                                    sendFile={sendFile}
                                    handleSend={handleSend}
                                    handleKeyDown={handleKeyDown}
                                    sendTypingNotification={sendTypingNotification}
                                    typingUser={typingUser}
                                    seenUser={seenUser}
                                    sendSeenNotification={sendSeenNotification}
                                    seenNotif={seenNotif}
                                    handleSendAudio={handleSendAudio}
                                    recordingAudio={recordingAudio}
                                    sendRecordingNotification={sendRecordingNotification}
                                    loading={loading}
                                    fileInputRef={fileInputRef}
                                    imagePreview={imagePreview}
                                    idDiscussion={idDiscussion}
                                    receiver={receiver}
                                    lastMessage={lastMessage}
                                    scrollToBottomInput={scrollToBottomInput}
                                />
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
                    onNewMessage={handleNew}
                />

            )}
        </>


    )
}

export default DiscussionSidebar
