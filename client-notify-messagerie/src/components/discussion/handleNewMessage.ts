import { Message } from '../../interfaces/Discussion'
import { convertKeysToCamelCase } from '../../utils/userUtils'
import { Action } from './DiscussionReducer'

interface HandleNewMessageProps {
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  dispatch: React.Dispatch<Action>;
  onMessageSent?: (message: Message) => void;
}

const handleNewMessage = ({ setMessages, dispatch, onMessageSent }: HandleNewMessageProps) => {
  return (message: Message) => {
    const newMessage = convertKeysToCamelCase(message)
    setMessages(prevMessages => {
      const updatedMessages = [...prevMessages, newMessage]
      return updatedMessages.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
    })

    dispatch({
      type: 'UPDATE_DISCUSSION',
      payload: {
        newMessage,
        timestamp: newMessage.timestamp
      }
    })

    if (onMessageSent) {
      onMessageSent(message)
    }
  }
}

export default handleNewMessage
