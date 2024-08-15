/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useRef, useState } from 'react'
import { Emoji } from '@emoji-mart/data'
import { useAuth } from '../../contexte/AuthContext'
import { ErrorResponse, User } from '../../interfaces'
import { Message } from '../../interfaces/Discussion'
import { WebSocketService } from '../../services/WebSocketService'
import API_ENDPOINTS from '../../api/endpoints'


interface DiscussionHandlerProps {
    render: (props: {
        handleChange: (field: 'message', value: string) => void;
        message: string;
        showEmojiPicker: {message: boolean};
        togglePicker: (picker: 'message') => void;
        addEmoji: (emoji: Emoji) => void;
        setPickerRef: (field: 'message') => (el: HTMLDivElement | null) => void;
        SendImage:(event: React.ChangeEvent<HTMLInputElement>) => void,
        SendFile: (event: React.ChangeEvent<HTMLInputElement>) => void,
        handleSend: (receiver: User , IdDiscussion: string)=> void,
    }) => React.ReactNode
    onNewMessage?: (message: Message) => void // New prop for handling new messages
}

export const DiscussionHandler: React.FC<DiscussionHandlerProps> = ({ render, onNewMessage  }) => {

    const { user, refreshUserData } = useAuth()

    const [message, setMessage] = useState<string>('')
    const [messages, setMessages] = useState<Message[]>([])
    const [webSocketService, setWebSocketService] = useState<WebSocketService | null>(null)

    //const webSocketService = useRef(new WebSocketService(API_ENDPOINTS.WEBSOCKET_URL, user.id)).current

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
        
    }, [])
    
    
    useEffect(() => {

        if(!user)return
            const webSocketService = new WebSocketService(API_ENDPOINTS.WEBSOCKET_URL, user.id)
            setWebSocketService(webSocketService)
        
            webSocketService.connect()

            webSocketService.onMessage((message: Message)=> {
                console.log('Message received: ', message)
                if (onNewMessage) {
                    onNewMessage(message)
                }
            })
            webSocketService.onError((error: ErrorResponse)=> {
                console.log('WebSocket error: ',error.error)
            })

            webSocketService.onClose(()=> {
                console.log('WebSocket conenction closed')
            })
            
            return ()=>{
                webSocketService.disconnect()
            }
        
    }, [user?.id])

    const handleSend = async (receiver: User, IdDiscussion: string)=> {
        if (message.trim() && user && webSocketService) {
            console.log('Message sent:', message)
            const messageDTO: Message = {
                discussionId: IdDiscussion,
                senderId: user.id,
                receiverId: receiver.id,
                content: message,
                timestamp: new Date(),
                read: false
            }

            try {
                if (messageDTO) {
                    console.log(messageDTO)
                    webSocketService.send(messageDTO)
                    setMessages((prevMessages) => [...prevMessages, messageDTO])
                    console.log(messages)
                    setMessage('')
                    refreshUserData()


                }
            } catch (error) {
                console.log('Failed to fetch messages')
            }

        }else {
            return null
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
            [picker]: !prev[picker]
        }))
    }

    const handleClickOutside = (event: MouseEvent) => {
        if (
            pickerRef.current.message &&
            !pickerRef.current.message.contains(event.target as Node)
        ) {
            setShowEmojiPicker(prev => ({ ...prev, message: false }))
        }
    }

    const addEmoji = (emoji: Emoji) => {
        const emojiStr: string = emoji.native
        setMessage((prev) => prev + emojiStr)
    }

    const SendImage = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        
        if (file) {
          try {
            console.log('hello image')
          } catch (err) {
            console.log('error')
          }
        }
      }

      const SendFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        
        if (file) {
          try {
            console.log('hello file')
          } catch (err) {
            console.log('error')
          }
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
        SendImage,
        SendFile,
        handleSend,
        //messages,
    })
}