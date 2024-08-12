/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useRef, useState } from 'react'
import { Emoji } from '@emoji-mart/data'
import { useAuth } from '../../contexte/AuthContext'
import { User } from '../../interfaces'
import messageService from '../../services/messageService'
import { Message } from '../../interfaces/Discussion'


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
}

export const DiscussionHandler: React.FC<DiscussionHandlerProps> = ({ render }) => {

    const { user, refreshUserData } = useAuth()
    const [message, setMessage] = useState<string>('')

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
        
    }, [])
    
    const handleSend = async (receiver: User, IdDiscussion: string)=> {
        if (message.trim() && user ) {
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
                    const response = await messageService.sendMessage(messageDTO)
                    refreshUserData()
                    console.log(response)
                    setMessage('')

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
    })
}