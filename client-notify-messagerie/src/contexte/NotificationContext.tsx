// NotificationContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react'

// Define the shape of the context state
interface NotificationContextType {
    hasUnreadMessages: boolean;
    setHasUnreadMessages: (status: boolean) => void;
}

// Create a default value for the context
const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

// Create a custom hook for easier usage of the context
export const useNotification = (): NotificationContextType => {
    const context = useContext(NotificationContext)
    if (!context) {
        throw new Error('useNotification must be used within a NotificationProvider')
    }
    return context
}

// Create a provider component
export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [hasUnreadMessages, setHasUnreadMessages] = useState<boolean>(false)

    return (
        <NotificationContext.Provider value={{ hasUnreadMessages, setHasUnreadMessages }}>
            {children}
        </NotificationContext.Provider>
    )
}
