import { useCallback, useState, useEffect, useRef } from 'react'
import messageService from '../../services/messageService'
import { User } from '../../interfaces'
import { Message } from '../../interfaces/Discussion'

interface UseFetchMessagesProps {
  user: User | null;
  receiver: User | null;
  idDiscussion: string;
}

const useFetchMessages = ({ user, receiver, idDiscussion }: UseFetchMessagesProps) => {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [loadingMore, setLoadingMore] = useState<boolean>(false)
  const [cursor, setCursor] = useState<Date | null>(null)
  const [hasMore, setHasMore] = useState<boolean>(true)
  const [initialFetchComplete, setInitialFetchComplete] = useState<boolean>(false)


  const chatContainerRef = useRef<HTMLDivElement | null>(null)

  const fetchMessages = useCallback(async (cursor?: Date | null) => {
    if (!user || !receiver || !idDiscussion) return

    setLoadingMore(true)

    try {
      const discussionData = await messageService.getDiscussion(receiver.id, user.id, cursor ?? undefined)
      const fetchedMessages = discussionData.messages

      if (fetchedMessages.length > 0) {
        // Deduplicate messages based on a unique identifier (e.g., id or timestamp)
        setMessages(prevMessages => {
          const newMessages = fetchedMessages.filter(
            (msg: Message) => !prevMessages.some(existingMsg => existingMsg.id === msg.id) // Or compare by timestamp if needed
          )

          // Prepend older messages
          if (cursor) {
            return [...newMessages, ...prevMessages]
          } else {
            // Append new messages
            return [...prevMessages, ...newMessages]
          }
        })

        if (cursor) {
          setCursor(new Date(fetchedMessages[0].timestamp))
        } else {
          setCursor(new Date(fetchedMessages[fetchedMessages.length - 1].timestamp))
        }
      } else {
        setHasMore(false)
      }

    } catch (error) {
      console.error('Failed to fetch messages:', error)
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }, [user, receiver, idDiscussion])

  // Reset messages when the discussion ID changes
  useEffect(() => {
    setMessages([])
    setCursor(null)
    setHasMore(true)
    setInitialFetchComplete(false)
  }, [idDiscussion])

  useEffect(() => {
    if (messages.length > 0 && chatContainerRef.current) {
      if (!initialFetchComplete) {
        chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
        setInitialFetchComplete(true)
      } else {
        console.log('sebsequeent fetch ! ')
      }
    }

  }, [messages, initialFetchComplete])
  return {
    messages,
    loading,
    loadingMore,
    fetchMessages,
    cursor,
    hasMore,
    chatContainerRef,
  }
}

export default useFetchMessages
