import React, { createContext, useState, useContext, ReactNode } from 'react'
import { User } from '../interfaces'
import { useAuth } from './AuthContext' // Import the AuthContext
import { Message } from '../interfaces/Discussion'
import { useWebSocket } from '../hooks/webSocketHook'

interface DiscussionContextType {
    messages: Message[];
    typingUser: string | null;
    seenUser: boolean;
    sendMessage: (messageDTO: Message) => Promise<void>;
    sendTypingNotification: (discussionId: string, receiver: User) => void;
    sendSeenNotification: (messageId: string, discussionId: string, receiver: User) => void;
    seenNotif: {
        isSeen: boolean;
        seenDate?: Date;
    };
    

}

const DiscussionContext = createContext<DiscussionContextType | undefined>(undefined)

export const DiscussionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const { user } = useAuth() // Use the AuthContext to get the user
    const [messages, setMessages] = useState<Message[]>([])

    const onNewMessage = (message: Message) => {
        setMessages(prevMessages => [...prevMessages, message])
    }

    const { typingUser, seenUser, sendMessage, sendTypingNotification, sendSeenNotification, seenNotif } = useWebSocket(user, onNewMessage)

    const contextValue = {
        messages,
        typingUser,
        seenUser,
        sendMessage,
        sendTypingNotification,
        sendSeenNotification,
        seenNotif
    }

    return (
        <DiscussionContext.Provider value={contextValue}>
            {children}
        </DiscussionContext.Provider>
    )
}

export const useDiscussion = (): DiscussionContextType => {
    const context = useContext(DiscussionContext)
    if (!context) {
        throw new Error('useDiscussion must be used within a DiscussionProvider')
    }
    return context
}
