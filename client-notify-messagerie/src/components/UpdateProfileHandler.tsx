/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useRef, useState } from 'react'
import { useAuth } from '../contexte/AuthContext'
import { useThemeContext } from '../contexte/ThemeContext'
import defaultAvatar from '../assets/default-avatar.png' // Adjust the path as necessary
import defaultAvatarNight from '../assets/default-avatar-night.png' // Dark theme
import { uploadFile } from '../services/userService'
import { updateProfile } from '../store/userSlice'
import { toast } from 'react-toastify'
import { useAppDispatch } from '../hooks/reduxHooks'
import { logout } from '../store/authSlice'
import { Emoji } from '@emoji-mart/data'


interface UpdateProfileHandlerProps {
    render: (props: {
        avatarUrl: string;
        handleChangeAvatar: (event: React.ChangeEvent<HTMLInputElement>) => void;
        user: { username?: string; about?: string; phoneNumber?: string; createdAt?: Date }
        handleUpdate: (field: 'username' | 'about', value: string) => void;
        editing: { [key: string]: boolean },
        handleEditToggle: (field: string) => void,
        username: string;
        about: string;
        imageUrl: string | null;
        handleUpdateProfile: (event: React.FormEvent<HTMLFormElement>) => void;
        charsRemaining: { username: number; about: number },
        isHovered: { [key: string]: boolean };
        handleMouseEnter: (field: 'username' | 'about') => void;
        handleMouseLeave: (field: 'username' | 'about') => void;
        showEmojiPicker: { username: boolean; about: boolean };
        togglePicker: (picker: 'username' | 'about') => void;
        error?: string | null
        handleLogout: () => void;
        isLoadingButton: { [key: string]: boolean };
        addEmoji: (emoji: Emoji) => void;
        setPickerRef: (field: 'username' | 'about') => (el: HTMLDivElement | null) => void;
        isUpLoading: boolean;
        formattedPhoneNumber: string;
    }) => React.ReactNode
}


export const UpdateProfileHandler: React.FC<UpdateProfileHandlerProps> = ({ render }) => {

    const { theme } = useThemeContext()

    const [imageUrl, setImageUrl] = useState<string | null>(null)
    const [error, setError] = useState<string | null>(null)
    const { user, refreshUserData } = useAuth()
    const defaultUser = { username: '', password: '', phoneNumber: '', createdAt: new Date() }
    const [editing, setEditing] = useState<{ [key: string]: boolean }>({
        username: false,
        about: false,
    })
    const [username, setUsername] = useState<string>(user?.username ?? '')
    const [about, setAbout] = useState<string>(user?.about ?? '')
    const [formattedPhoneNumber, setFormattedPhoneNumber] = useState<string>('')
    const [isHovered, setIsHovered] = useState<{ [key: string]: boolean }>({
        username: false,
        about: false,
    })

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [])

    useEffect(() => {
        if (user?.phoneNumber) {
            setFormattedPhoneNumber(formatPhoneNumber(user.phoneNumber))
        }
    }, [user?.phoneNumber])

    const maxLengths = {
        username: 25,
        about: 139,
    }

    const charsRemainingRef = useRef<{ username: number, about: number }>({
        username: maxLengths.username,
        about: maxLengths.about
    })

    const pickerRef = useRef<{ username: HTMLDivElement | null; about: HTMLDivElement | null }>({
        username: null,
        about: null
    })

    const dispatch = useAppDispatch()

    const [showEmojiPicker, setShowEmojiPicker] = useState<{ username: boolean; about: boolean }>({
        username: false,
        about: false
    })

    const [isLoadingButton, setIsLoadingButton] = useState<{ [key: string]: boolean }>({
        updateProfile: false,
        logout: false,
    })

    const [isUpLoading, setIsUpLoading] = useState<boolean>(false)

    const getAvatarUrl = (theme: string, user?: { avatarUrl?: string }) => {
        if (user?.avatarUrl) { return user.avatarUrl }
        return theme === 'dark' ? defaultAvatarNight : defaultAvatar
    }

    const avatarUrl = getAvatarUrl(theme, user ?? {})

    const togglePicker = (picker: 'username' | 'about') => {
        setShowEmojiPicker(prev => ({
            ...prev,
            [picker]: !prev[picker]
        }))
    }

    const handleClickOutside = (event: MouseEvent) => {
        if (
            pickerRef.current.username &&
            !pickerRef.current.username.contains(event.target as Node)
        ) {
            setShowEmojiPicker(prev => ({ ...prev, username: false }))
        }
        if (
            pickerRef.current.about &&
            !pickerRef.current.about.contains(event.target as Node)
        ) {
            setShowEmojiPicker(prev => ({ ...prev, about: false }))
        }
    }

    const handleUpdate = (field: 'username' | 'about', value: string) => {
        if (field === 'username') {
            if (value.length < maxLengths.username) {
                setUsername(value)
            }
            charsRemainingRef.current.username = maxLengths.username - value.length
        } else if (field === 'about') {
            if (value.length < maxLengths.about) {
                setAbout(value)
            }
            charsRemainingRef.current.about = maxLengths.about - value.length

        }
    }

    const addEmoji = (emoji: Emoji) => {
        const emojiStr: string = emoji.native

        if (editing.username) {
            // Calculate the new length including the emoji
            const newLength = username.length + emojiStr.length

            // Check if it exceeds the maximum length
            if (newLength <= maxLengths.username) {
                setUsername((prev) => prev + emojiStr)
                charsRemainingRef.current.username = maxLengths.username - newLength
            }

        } else if (editing.about) {
            // Calculate the new length including the emoji
            const newLength = about.length + emojiStr.length
            // Check if it exceeds the maximum length
            if (newLength <= maxLengths.about) {
                setAbout((prev) => prev + emojiStr)
                charsRemainingRef.current.about = maxLengths.about - newLength
            }
        }
    }

    const handleUpdateProfile = async (e: React.FormEvent<HTMLFormElement>) => {

        setIsLoadingButton(prev => ({ ...prev, updateProfile: true }))
        e.preventDefault()

        const updateProfileReq = { username, about, avatarUrl }
        const id = user?.id ?? ''
        try {
            const resultAction = await dispatch(updateProfile({ id, updateProfileReq }))
            console.log(resultAction)

        } catch (error) {
            console.error('Failed Updating error:', error)
            toast.error('An unexpected error occurred during Updating.')
        } finally {
            setIsLoadingButton(prev => ({ ...prev, updateProfile: false }))
            refreshUserData()
            if (username !== user?.username) {
                handleEditToggle('username')
            } else if (about !== user?.about) {
                handleEditToggle('about')
            }
        }
    }

    const setPickerRef = (field: 'username' | 'about') => (el: HTMLDivElement | null) => {
        if (pickerRef.current) {
            pickerRef.current[field] = el
        }
    }

    const handleEditToggle = (field: string) => {
        setEditing((prevEditing) => ({ ...prevEditing, [field]: !prevEditing[field] }))
    }
    const handleChangeAvatar = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]

        if (file) {
            try {
                setIsUpLoading(true)
                const result = await uploadFile(file, user?.id || null)
                setImageUrl(result.url)
                await refreshUserData()
                setError(null)
            } catch (err) {
                setError('Failed to upload file')
                setImageUrl(null)
            } finally {
                setIsUpLoading(false) // Deactivate spinner here
            }
        }
    }

    const handleMouseEnter = (field: 'username' | 'about') => {
        setIsHovered(prev => ({ ...prev, [field]: true }))
    }

    const handleMouseLeave = (field: 'username' | 'about') => {
        setIsHovered(prev => ({ ...prev, [field]: false }))
    }

    const handleLogout = async () => {

        setIsLoadingButton(prev => ({ ...prev, logout: true }))
        try {
            if (!user || !user.id) {
                console.error('Username is not available for logout')
                return
            }

            await dispatch(logout({ userId: user?.id }))
        } catch (error) {
            console.error('Logout failed:', error)
        } finally {
            setIsLoadingButton(prev => ({ ...prev, logout: false }))
        }
    }

    function formatPhoneNumber(phoneNumber: string) {
        const cleaned = ('' + phoneNumber).replace(/\D/g, '')
        const match = cleaned.match(/^(\d{3})(\d{3})(\d{6})$/)

        if (match) {
            return `+${match[1]} ${match[2]}-${match[3]}`
        }
        return phoneNumber
    }


    return render({
        avatarUrl,
        handleChangeAvatar,
        user: user ?? defaultUser,
        imageUrl,
        handleUpdate,
        editing,
        handleEditToggle,
        username,
        about,
        handleUpdateProfile,
        charsRemaining: charsRemainingRef.current,
        isHovered,
        handleMouseEnter,
        handleMouseLeave,
        showEmojiPicker,
        togglePicker,
        error,
        handleLogout,
        isLoadingButton,
        addEmoji,
        setPickerRef,
        isUpLoading,
        formattedPhoneNumber,
    })
}