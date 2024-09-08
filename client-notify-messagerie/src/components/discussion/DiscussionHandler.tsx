/* eslint-disable @typescript-eslint/no-unused-vars */
// src/components/DiscussionHandler.tsx
import React, { useRef, useState } from 'react'
import { Emoji } from '@emoji-mart/data'
import { useAuth } from '../../contexte/AuthContext'
import { AudioMessage, Message, SeenNotif, FileMessage } from '../../interfaces/Discussion'
import { User } from '../../interfaces'
import { useWebSocket } from '../../hooks/webSocketHook'
import cloudinaryService from '../../services/cloudinaryService'

interface DiscussionHandlerProps {
    render: (props: {
        handleChange: (field: 'message', value: string) => void;
        message: string;
        showEmojiPicker: { message: boolean };
        togglePicker: (picker: 'message') => void;
        addEmoji: (emoji: Emoji) => void;
        setPickerRef: (field: 'message') => (el: HTMLDivElement | null) => void;
        sendImage: (event: React.ChangeEvent<HTMLInputElement>, idDiscussion: string, receiver: User) => void;
        sendFile: (event: React.ChangeEvent<HTMLInputElement>) => void;
        handleSend: (receiver: User, IdDiscussion: string) => void;
        handleKeyDown: (e: React.KeyboardEvent<HTMLInputElement>, receiver: User, idDiscussion: string) => void;
        sendTypingNotification: (discussionId: string, receiver: User) => void;
        typingUser: string | null;
        seenUser: boolean | null;
        sendSeenNotification: (messageId: string, discussionId: string, receiver: User) => void;
        seenNotif: SeenNotif;
        handleSendAudio: (blob: Blob, IdDiscussion: string, receiver: User) => void;
        recordingAudio: string | null;
        sendRecordingNotification: (discussionId: string, receiver: User) => void;
        loading: boolean;
        fileInputRef: React.RefObject<HTMLInputElement>
        imagePreview: string | null
    }) => React.ReactNode;
    onNewMessage?: (message: Message) => void;
}

export const DiscussionHandler: React.FC<DiscussionHandlerProps> = ({ render, onNewMessage }) => {
    const { user, refreshUserData } = useAuth()
    const [message, setMessage] = useState<string>('')
    const [messages, setMessages] = useState<Message[]>([])
    const [loading, setLoading] = useState(false)
    const [imagePreview, setImagePreview] = useState<string | null>(null)
    const fileInputRef = useRef(null)


    // WebSocket hook
    const { webSocketService, sendMessage, typingUser, recordingAudio, seenUser, sendTypingNotification, sendSeenNotification, sendRecordingNotification, seenNotif } = useWebSocket(user, onNewMessage)

    const handleSend = async (receiver: User, IdDiscussion: string) => {

        if (message.trim() && user && webSocketService) {
            const messageDTO: Message = {
                id: '',
                discussionId: IdDiscussion,
                senderId: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                receiverId: receiver.id,
                content: message,
                timestamp: new Date(),
                read: false,
                readTime: new Date(),
                type: 'message',
            }


            try {
                await sendMessage(messageDTO)
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

    const sendImage = async (event: React.ChangeEvent<HTMLInputElement>, IdDiscussion: string, receiver: User) => {
        const file = event.target.files?.[0]
        if (file) {
            const previewUrl = URL.createObjectURL(file)
            setImagePreview(previewUrl)
            setLoading(true)
            try {
                // sendRecordingNotification(lastMessage.discussionId, receiver)
                const filePath = await cloudinaryService.uploadFile(file)
                if (user && webSocketService) {

                    const fileMessage: FileMessage = {
                        id: '',
                        discussionId: IdDiscussion,
                        firstName: user.firstName,
                        lastName: user.lastName,
                        senderId: user.id,
                        receiverId: receiver.id,
                        content: filePath,
                        type: 'file',
                        readTime: new Date(),
                        read: false,
                        timestamp: new Date()
                    }
                    console.log(fileMessage)
                    const ImageMessage = await sendMessage(fileMessage)
                    console.log(ImageMessage)
                    setMessages(prevMessages => [...prevMessages, fileMessage])
                    //console.log('sift messaghat',messages)
                    setMessage('')
                    refreshUserData()
                    console.log(fileMessage)
                }
            } catch (err) {
                console.error('Error handling image file:', err)
            } finally {
                setLoading(false)
                if (fileInputRef.current) {
                    fileInputRef.current.value = '' // Reset the file input value
                }
                URL.revokeObjectURL(previewUrl)
                setImagePreview(null)

            }
        }
    }

    const sendFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (file) {
            try {
                console.log('File selected:', file)
            } catch (err) {
                console.error('Error handling file:', err)
            }
        }
    }

    const handleSendAudio = async (blob: Blob, IdDiscussion: string, receiver: User) => {
        try {
            const audioFilePath = await cloudinaryService.uploadAudioFile(blob)
            if (user && webSocketService) {

                const audioMessage: AudioMessage = {
                    id: '', // Implement unique ID generation
                    discussionId: IdDiscussion,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    senderId: user.id,
                    receiverId: receiver.id,
                    content: audioFilePath,
                    type: 'audio',
                    readTime: new Date(),
                    read: false,
                    timestamp: new Date()
                }
                console.log(audioMessage)
                const MessageAudio = await sendMessage(audioMessage)
                console.log(MessageAudio)
                setMessages(prevMessages => [...prevMessages, audioMessage])
                setMessage('')
                refreshUserData()
                console.log(audioMessage)
            }
        } catch (error) {
            console.error('Failed to upload or send audio message:', error)
        }
    }

    const handleChange = (field: 'message', value: string) => {
        if (field === 'message') {
            setMessage(value)
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
        handleSendAudio,
        recordingAudio,
        sendRecordingNotification,
        loading,
        fileInputRef,
        imagePreview,
    })
}
