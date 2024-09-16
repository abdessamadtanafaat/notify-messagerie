import { useCallback, useEffect, useReducer, useRef, useState } from 'react'
import { DiscussionReducer, initialState } from './DiscussionReducer'
import { useFetchDiscussions } from '../../hooks/useFetchDiscussions'
import { useSearchDiscussions } from '../../hooks/useSearchDiscussions'
import { useOutsideClick } from '../../hooks/useOutsideClick'
import { useWebSocket } from '../../hooks/webSocketHook'
import { useAuth } from '../../contexte/AuthContext'
import { useNotification } from '../../contexte/NotificationContext'
import messageService from '../../services/messageService'
import { Message } from '../../interfaces/Discussion'
import { User } from '../../interfaces'

const useDiscussionPageHandler = () => {
    const [state, dispatch] = useReducer(DiscussionReducer, initialState)
    const [fetchingDiscussions, setFetchingDiscussions] = useState(false)
    const [initialFetchComplete, setInitialFetchComplete] = useState(false)
    
    const { fetchDiscussions } = useFetchDiscussions(dispatch)
    const { searchDiscussions } = useSearchDiscussions(dispatch)
    const { user, refreshUserData } = useAuth()
    const { setHasUnreadMessages } = useNotification()

    const userId = user?.id ?? ''
    const menuRef = useRef<HTMLUListElement>(null)
    useOutsideClick(menuRef, () => dispatch({ type: 'TOGGLE_MENU', payload: null }))

    useEffect(() => {
        const fetchInitialDiscussions = async () => {
            setFetchingDiscussions(true)
            try {
                await fetchDiscussions(userId)
                setInitialFetchComplete(true)
            } finally {
                setFetchingDiscussions(false)
            }
        }
        fetchInitialDiscussions()
    }, [fetchDiscussions, userId])

    const handleSearchChange = useCallback(
        (value: string) => {
            if (user && value.trim()) {
                searchDiscussions(user.id, value.trim())
            } else {
                dispatch({ type: 'SET_DISCUSSIONS_SEARCH', payload: [] })
            }
        },
        [searchDiscussions, user]
    )

    const handleClearSearch = useCallback(() => {
        dispatch({ type: 'SET_SEARCH_INPUT', payload: '' })
    }, [dispatch])

    // const handleNewMessage = (newMessage: Message) => {
    //     setHasUnreadMessages(true)
    //     const timestamp = newMessage.timestamp instanceof Date ? newMessage.timestamp : new Date(newMessage.timestamp)
    //     dispatch({
    //         type: 'UPDATE_DISCUSSION',
    //         payload: {
    //             newMessage,
    //             timestamp: timestamp.toISOString()
    //         }
    //     })
    // }

    const handleNewMessage = useCallback(
        (newMessage: Message) => {
            setHasUnreadMessages(true)
    
            // Ensure timestamp is always a string
            const timestamp = newMessage.timestamp instanceof Date
                ? newMessage.timestamp.toISOString()
                : newMessage.timestamp
    
            dispatch({
                type: 'UPDATE_DISCUSSION',
                payload: {
                    newMessage,
                    timestamp,
                },
            })
        },
        [setHasUnreadMessages]
    )
    
    
    const handleUserClick = async (receiver: User, idDiscussion: string) => {
        dispatch({ type: 'SET_SELECTED_USER', payload: { user: receiver, idDiscussion } })
        try {
            if (user) {
                const discussionData = await messageService.getDiscussion(receiver.id, user.id)
                dispatch({ type: 'SET_MESSAGES', payload: discussionData.messages })

                if (user?.id === discussionData.messages[discussionData.messages.length - 1].receiverId) {
                    sendSeenNotification(discussionData.messages[discussionData.messages.length - 1].id, discussionData.id, receiver)
                }
            }
            refreshUserData()
        } catch (error) {
            console.log('Failed to fetch messages')
        }
    }

    const { sendSeenNotification } = useWebSocket(user, handleNewMessage)

    
    return {
        userId,
        state,
        dispatch,
        fetchingDiscussions,
        initialFetchComplete,
        menuRef,
        handleSearchChange,
        handleClearSearch,
        handleUserClick,
        handleNewMessage
    }
}

export default useDiscussionPageHandler
