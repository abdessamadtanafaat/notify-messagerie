// src/hooks/useWebSocket.ts
import { useEffect, useState, useCallback } from 'react'
import { WebSocketService } from '../services/WebSocketService'
import API_ENDPOINTS from '../api/endpoints'
import { Message, SeenNotification, TypingNotification } from '../interfaces/Discussion'
import { ErrorResponse, User } from '../interfaces'

export const useWebSocket = (user: User | null, onNewMessage?: (message: Message) => void) => {
    const [webSocketService, setWebSocketService] = useState<WebSocketService | null>(null)
    const [typingUser, setTypingUser] = useState<string | null>(null)
    // const [isSeen, setIsSeen] = useState<boolean>(false)
    // const [seenDate, setIsSeenDate] = useState<Date>()

    const [seenNotif, setSeenNotif] = useState({
        isSeen: false,
        seenDate: undefined as Date | undefined
    })

        // Function to update the state object
        const updateSeenNotifState = (newState: Partial<typeof seenNotif>) => {
            setSeenNotif(prevState => ({
                ...prevState,
                ...newState
            }))
        }

    const handleSeenNotification = useCallback((notification: SeenNotification) => {
        console.log('Seen notification received:', notification)
        console.log(notification.isSeen)
        console.log(notification.readTime)


        // Update your state or UI as needed
    }, [])

    
    useEffect(() => {
        if (!user) return
    
        const wsService = new WebSocketService(API_ENDPOINTS.WEBSOCKET_URL, user.id)
        console.log('Initializing WebSocketService:', wsService)
    
        wsService.connect()
    
        wsService.onMessage((message: Message | TypingNotification | SeenNotification) => {
            console.log('Message received:', message)
    
            if ('content' in message) {
                // It's a Message
                if (onNewMessage) onNewMessage(message as Message)
                    setTypingUser(null)
            } else if (message.type === 'typing') {
                // It's a TypingNotification
                setTypingUser(message.senderId)
            } else if (message.type === 'seen') {
                // It's a SeenNotification
                updateSeenNotifState({
                    isSeen: true,
                    seenDate: new Date()
                })
                handleSeenNotification(message as SeenNotification)
            }
        })
    
        wsService.onError((error: ErrorResponse) => {
            console.error('WebSocket error:', error.error)
        })
    
        wsService.onClose(() => {
            console.log('WebSocket connection closed')
            setWebSocketService(null) // Reset on close
        })
    
        setWebSocketService(wsService)
    
    }, [user, onNewMessage, handleSeenNotification])
    
    useEffect(() => {
        if (typingUser) {
            const timeout = setTimeout(() => setTypingUser(null), 3000)
            return () => clearTimeout(timeout)
        }
    }, [typingUser])


    const sendMessage = useCallback(async (messageDTO: Message) => {
        if (webSocketService) {
            try {
                await webSocketService.send(messageDTO)
                console.log('Message sent:', messageDTO)
            } catch (error) {
                console.error('Failed to send message:', error)
            } finally {
                setTypingUser(null)
            }
        } else {
            console.warn('WebSocketService is not initialized.')
        }
    }, [webSocketService])

    const sendTypingNotification = useCallback((receiver: User) => {
        if (user && webSocketService) {
            const typingNotification: TypingNotification = {
                type: 'typing',
                senderId: user.id,
                receiverId: receiver.id,
            }
            try {
                webSocketService.send(typingNotification)
                console.log('Typing notification sent:', typingNotification)
            } catch (error) {
                console.error('Failed to send typing notification:', error)
            }
        } else {
            console.warn('User or WebSocketService is not available.')
        }
    }, [user, webSocketService])

    const sendSeenNotification = useCallback((messageId: string, receiver: User) => {
        if (user && webSocketService) {
            const seenNotification: SeenNotification = {
                type: 'seen',
                messageId,
                senderId: user.id,
                receiverId: receiver.id,
                readTime: new Date(),
                isSeen: true,

            }
            try {
                webSocketService.send(seenNotification)
                console.log('Seen notification sent:', seenNotification)
            } catch (error) {
                console.error('Failed to send seen notification:', error)
            }
        } else {
            console.warn('User or WebSocketService is not available.')
        }
    }, [user, webSocketService])

    return { webSocketService, typingUser, sendMessage, sendTypingNotification,sendSeenNotification,seenNotif }
}
