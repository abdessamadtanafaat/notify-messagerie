/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useRef, useState } from 'react'
import { Emoji } from '@emoji-mart/data'


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
        handleSend: ()=> void,
    }) => React.ReactNode
}

export const DiscussionHandler: React.FC<DiscussionHandlerProps> = ({ render }) => {


    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [])
    
    const pickerRef = useRef<{ message: HTMLDivElement | null }>({
        message: null,
    })

    const [showEmojiPicker, setShowEmojiPicker] = useState<{ message: boolean }>({
        message: false,
    })

    const [message, setMessage] = useState<string>('')
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

    const handleSend = ()=> {
        if (message.trim()) {
            // Handle sending the message (e.g., API call, updating state)
            console.log('Message sent:', message)
            setMessage('') 

        }else {
            return null
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