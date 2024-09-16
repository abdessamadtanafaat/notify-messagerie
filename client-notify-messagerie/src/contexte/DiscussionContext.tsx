import React, { createContext, useState, useContext, ReactNode, useReducer } from 'react'
import { User } from '../interfaces'
import { useAuth } from './AuthContext' // Import the AuthContext
import { Discussion, Message } from '../interfaces/Discussion'
import { useWebSocket } from '../hooks/webSocketHook'
import { DiscussionReducer, initialState } from '../components/discussion/DiscussionReducer'

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
    discussions: Discussion[]; 

}

const DiscussionContext = createContext<DiscussionContextType | undefined>(undefined)

export const DiscussionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const { user } = useAuth() // Use the AuthContext to get the user
    const [messages, setMessages] = useState<Message[]>([])

    const [state, dispatch] = useReducer(DiscussionReducer, initialState)


    const onNewMessage = (message: Message) => {
        setMessages(prevMessages => [...prevMessages, message])

                // Dispatch UPDATE_DISCUSSION to move the discussion to the top
                dispatch({
                    type: 'UPDATE_DISCUSSION',
                    payload: {
                        newMessage: message,
                        timestamp: new Date().toISOString() // Use current timestamp or message timestamp
                    }
                })

    }

    const { typingUser, seenUser, sendMessage, sendTypingNotification, sendSeenNotification, seenNotif } = useWebSocket(user, onNewMessage)

    const contextValue = {
        messages,
        typingUser,
        seenUser,
        sendMessage,
        sendTypingNotification,
        sendSeenNotification,
        seenNotif,
        discussions: state.discussions
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

