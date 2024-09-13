import { useCallback, useState } from 'react'
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

  const fetchMessages = useCallback(async (cursor?: Date | null) => {
    if (!user || !receiver || !idDiscussion) return

    setLoadingMore(true)

    try {
      const discussionData = await messageService.getDiscussion(receiver.id, user.id, cursor ?? undefined)
      const newMessages = discussionData.messages

      setMessages(prevMessages => {
        const existingMessageIds = new Set(prevMessages.map(msg => msg.id))
        const filteredMessages = newMessages.filter((msg: Message) => !existingMessageIds.has(msg.id))
        const updatedMessages = [...filteredMessages, ...prevMessages]
        return updatedMessages.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
      })

      setCursor(newMessages.length > 0 ? new Date(newMessages[0].timestamp) : null)
      setHasMore(newMessages.length > 0)
    } catch (error) {
      console.error('Failed to fetch messages:', error)
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }, [user, receiver, idDiscussion])

  return {
    messages,
    loading,
    loadingMore,
    fetchMessages,
    cursor,
    hasMore
  }
}

export default useFetchMessages
