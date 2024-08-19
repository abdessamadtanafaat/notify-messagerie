/* eslint-disable @typescript-eslint/no-unused-vars */
// src/components/DiscussionHandler.tsx
import React, { useRef, useState } from 'react'
import { Emoji } from '@emoji-mart/data'
import { useAuth } from '../../contexte/AuthContext'
import { Message, SeenNotif } from '../../interfaces/Discussion'
import { User } from '../../interfaces'
import { useWebSocket } from '../../hooks/webSocketHook'

interface DiscussionHandlerProps {
    render: (props: {
        handleChange: (field: 'message', value: string) => void;
        message: string;
        showEmojiPicker: { message: boolean };
        togglePicker: (picker: 'message') => void;
        addEmoji: (emoji: Emoji) => void;
        setPickerRef: (field: 'message') => (el: HTMLDivElement | null) => void;
        sendImage: (event: React.ChangeEvent<HTMLInputElement>) => void;
        sendFile: (event: React.ChangeEvent<HTMLInputElement>) => void;
        handleSend: (receiver: User, IdDiscussion: string) => void;
        handleKeyDown: (e: React.KeyboardEvent<HTMLInputElement>, receiver: User, idDiscussion: string) => void;
        sendTypingNotification: (discussionId: string,receiver: User) => void;
        typingUser: string | null;
        seenUser: boolean | null;
        sendSeenNotification: (messageId: string,discussionId: string, receiver: User) => void;
        seenNotif: SeenNotif; 

    }) => React.ReactNode;
    onNewMessage?: (message: Message) => void;
}

export const DiscussionHandler: React.FC<DiscussionHandlerProps> = ({ render, onNewMessage }) => {
    const { user, refreshUserData } = useAuth()
    const [message, setMessage] = useState<string>('')
    const [messages, setMessages] = useState<Message[]>([])

    // WebSocket hook
    const { webSocketService, sendMessage, typingUser,seenUser, sendTypingNotification,sendSeenNotification,seenNotif } = useWebSocket(user, onNewMessage)

    const handleSend = async (receiver: User, IdDiscussion: string) => {
        console.log('blabla', webSocketService)

        if (message.trim() && user && webSocketService) {
            const messageDTO: Message = {
                discussionId: IdDiscussion,
                senderId: user.id,
                receiverId: receiver.id,
                content: message,
                timestamp: new Date(),
                read: false,
                type: 'message',
                //readTime: new Date(),
            }
            
            try {
                await sendMessage(messageDTO)
                console.log(messageDTO.discussionId)
                setMessages(prevMessages => [...prevMessages, messageDTO])
                setMessage('')
                refreshUserData()
                
            } catch (error) {
                console.error('Failed to send message:', error)
            }
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, receiver: User, idDiscussion: string) => {
        if (e.key === 'Enter') {
            e.preventDefault()
            handleSend(receiver, idDiscussion)
        }
    }

    const pickerRef = useRef<{ message: HTMLDivElement | null }>({
        message: null,
    })

    const [showEmojiPicker, setShowEmojiPicker] = useState<{ message: boolean }>({
        message: false,
    })

    const togglePicker = (picker: 'message') => {
        setShowEmojiPicker(prev => ({
            ...prev,
            [picker]: !prev[picker],
        }))
    }

    const addEmoji = (emoji: Emoji) => {
        const emojiStr: string = emoji.native
        setMessage(prev => prev + emojiStr)
    }

    const sendImage = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (file) {
            try {
                console.log('Image file selected:', file)
                // Handle image file upload
            } catch (err) {
                console.error('Error handling image file:', err)
            }
        }
    }

    const sendFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (file) {
            try {
                console.log('File selected:', file)
                // Handle file upload
            } catch (err) {
                console.error('Error handling file:', err)
            }
        }
    }

    const handleChange = (field: 'message', value: string) => {
        if (field === 'message') {
            setMessage(value)
            // Optionally handle typing notifications here if needed
        }
    }

    const setPickerRef = (field: 'message') => (el: HTMLDivElement | null) => {
        if (pickerRef.current) {
            pickerRef.current[field] = el
        }
    }


    return render({
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
        sendTypingNotification,
        typingUser,
        seenUser,
        sendSeenNotification,
        seenNotif,
    })
}
