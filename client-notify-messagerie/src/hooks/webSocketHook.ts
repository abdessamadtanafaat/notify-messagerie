// src/hooks/useWebSocket.ts
import { useEffect, useState, useCallback } from 'react'
import { WebSocketService } from '../services/WebSocketService'
import API_ENDPOINTS from '../api/endpoints'
import { AudioMessage, Message, SeenNotification, TypingNotification } from '../interfaces/Discussion'
import { ErrorResponse, User } from '../interfaces'
import { toast } from 'react-toastify'
import notificationSound from '../assets/notification.mp3'


export const useWebSocket = (user: User | null, onNewMessage?: (message: Message) => void) => {
    const [webSocketService, setWebSocketService] = useState<WebSocketService | null>(null)
    const [typingUser, setTypingUser] = useState<string | null>(null)
    const [seenUser, setSeenUser] = useState<boolean>(false)

    const [seenNotif, setSeenNotif] = useState({
        isSeen: false,
        seenDate: undefined as Date | undefined
    })


    useEffect(() => {
        if (!user) return
    
        const wsService = WebSocketService.getInstance(API_ENDPOINTS.WEBSOCKET_URL, user.id)
        //console.log('Initializing WebSocketService:', wsService)
    
        wsService.connect()
    
        wsService.onMessage((message: Message | TypingNotification | SeenNotification) => {
            //console.log('Message received:', message)
    
            if ('content' in message) {
                // It's a Message
                if (onNewMessage) onNewMessage(message as Message)
                    setTypingUser(null)
                    setSeenUser(false)
                    handleNewMessage(message as Message) //affiche the toast
            } else if (message.type === 'typing') {
                // It's a TypingNotification
                setTypingUser(message.senderId)
                setSeenUser(false)
            } else if (message.type === 'seen') {
                // It's a SeenNotification
                handleSeenNotification(message as SeenNotification)
                setSeenUser(true)
            }
        })
    
        wsService.onError((error: ErrorResponse) => {
            console.error('WebSocket error:', error.error)
        })
    
        wsService.onClose(() => {
            //console.log('WebSocket connection closed')
            setWebSocketService(null) // Reset on close
        })
    
        setWebSocketService(wsService)


    }, [user, onNewMessage,])
    
    useEffect(() => {
        if (typingUser) {
            const timeout = setTimeout(() => setTypingUser(null), 3000)
            return () => clearTimeout(timeout)
        }
    }, [typingUser,seenUser])


const handleNewMessage = (newMessage: Message) => {
    const audio = new Audio(notificationSound)
    console.log(audio)
    audio.play()
    toast.info(`${newMessage.firstName} ${newMessage.lastName} sent you a new message`)
}
        // Function to update the state object
        const updateSeenNotifState = (newState: Partial<typeof seenNotif>) => {
            setSeenNotif(prevState => ({
                ...prevState,
                ...newState
            }))
        }

    const handleSeenNotification = (notification: SeenNotification) => {
        // toast.info(`${notification.senderId} see your message`)
        
        if (notification.isSeen && notification.readTime) {
            updateSeenNotifState({
                isSeen: true,
                seenDate: new Date(notification.readTime)
            })
        }
    }

    const sendMessage = useCallback(async (messageDTO: Message | AudioMessage) => {
        if (webSocketService) {
            try {
                await webSocketService.send(messageDTO)
                console.log('Message sent:', messageDTO)
            } catch (error) {
                console.error('Failed to send message:', error)
            } finally {
                setTypingUser(null)
                setSeenUser(false)
            }
        } else {
            console.warn('WebSocketService is not initialized.')
        }
    }, [webSocketService])

    const sendTypingNotification = useCallback((discussionId: string,receiver: User) => {
        if (user && webSocketService) {
            const typingNotification: TypingNotification = {
                type: 'typing',
                discussionId,
                senderId: user.id,
                receiverId: receiver.id,
            }
            try {
                webSocketService.send(typingNotification)
                //console.log('Typing notification sent:', typingNotification)
            } catch (error) {
                console.error('Failed to send typing notification:', error)
            }
        } else {
            console.warn('User or WebSocketService is not available.')
        }
    }, [user, webSocketService])

    const sendSeenNotification = useCallback((messageId: string,discussionId: string, receiver: User) => {
        if (user && webSocketService) {
            const seenNotification: SeenNotification = {
                type: 'seen',
                messageId,
                discussionId,
                senderId: user.id,
                receiverId: receiver.id,
                readTime: new Date(),
                isSeen: true,

            }
            try {
                webSocketService.send(seenNotification)
                //console.log('Seen notification sent:', seenNotification)
            } catch (error) {
                console.error('Failed to send seen notification:', error)
            }
        } else {
            console.warn('User or WebSocketService is not available.')
        }
    }, [user, webSocketService])

    return { webSocketService, typingUser,seenUser, sendMessage, sendTypingNotification,sendSeenNotification,seenNotif }
}
