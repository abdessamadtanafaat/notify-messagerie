/* eslint-disable @typescript-eslint/no-explicit-any */
import { CheckCheck, CircleEllipsis } from 'lucide-react'
import DiscussionMenu from './DiscussionMenu'
import LoadingMoreItemsSpinner from '../common/LoadingMoreItemsSpinner'
import { User } from '../../interfaces'
import { useThemeContext } from '../../contexte/ThemeContext'
import { useAuth } from '../../contexte/AuthContext'
import { getAvatarUrl, getTimeDifference } from '../../utils/userUtils'
import { useEffect, useReducer, useRef, useState } from 'react'
import useHandleScroll from '../../hooks/useHandleScroll'
import { useSearchDiscussions } from '../../hooks/useSearchDiscussions'
import { DiscussionReducer, initialState } from './DiscussionReducer'
import { useOutsideClick } from '../../hooks/useOutsideClick'

interface DiscussionListSearchProps {
  userId: string ; 
  searchReq: string;
  handleUserClick: (receiver: User, idDiscussion: string) => void; 

}

const DiscussionListSearch: React.FC<DiscussionListSearchProps> = ({
  userId,
  searchReq,
  handleUserClick,
}) => {
  const { theme } = useThemeContext()
  const { user } = useAuth()
  
  const menuRef = useRef<HTMLUListElement>(null)
  useOutsideClick(menuRef, () => { dispatch({ type: 'TOGGLE_MENU', payload: null }) })
  
  const [isSearching, setIsSearching] = useState(false)

  const [state, dispatch] = useReducer(DiscussionReducer, initialState)
  const { menuOpen, loadingMoreDiscussions,discussionsSearch } = state

    
  const { searchDiscussions, loadMoreDiscussions } = useSearchDiscussions(dispatch)
  
  useEffect(() => {
    setIsSearching(true)

    return () => {
      setIsSearching(false)
    }
  }, [discussionsSearch])

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsSearching(false)
    }, 500) 

    return () => clearTimeout(timer)
  }, [discussionsSearch, loadingMoreDiscussions])

  const { observerRef } = useHandleScroll({
    loadMoreFunction: loadMoreDiscussions,
    userId,
    searchReq
})

useEffect(() => {
  searchDiscussions(userId, searchReq)
  console.log(userId, searchReq)

}, [searchDiscussions, searchReq, userId])


  return (
    <div
      className="list-none flex flex-col space-y-2"
      ref={observerRef}
      style={{ height: '70vh', overflowY: 'auto' }}
    >
      {isSearching && !loadingMoreDiscussions ? (
        <LoadingMoreItemsSpinner /> 
      ) : discussionsSearch.length > 0 ? (
        discussionsSearch.map((discussion, index) => {
          const { id, lastMessage, receiver } = discussion
          const isMyMessage = lastMessage.senderId === user?.id
          const isAudioMessage = lastMessage.type === 'audio'
          const isFileMessage = lastMessage.type === 'file'

          let messageText = lastMessage.content

          if (isAudioMessage || isFileMessage) {
            messageText = isMyMessage
              ? isAudioMessage
                ? 'You sent a voice message.'
                : 'You sent a file.'
              : isAudioMessage
              ? 'Sent you a voice message.'
              : 'Sent you a file.'
          }

          const isMenuOpen = menuOpen === id

          return (
            <li
              key={index}
              className="flex flex-col space-y-1 p-1 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 ease-in-out group"
              onClick={() => handleUserClick(receiver, id)}
            >
              <div className="flex items-center space-x-3">
                <div className="relative flex-shrink-0">
                  <img
                    src={getAvatarUrl(theme, receiver ?? {})}
                    alt={`Avatar ${receiver.firstName}`}
                    className="w-6 h-6 rounded-full object-cover transition-opacity duration-300 ease-in-out hover:opacity-80"
                  />
                  <div
                    className={`absolute bottom-0 right-0 w-2 h-2 rounded-full border-2 border-white dark:border-gray-800 ${
                      discussion.receiver.active ? 'bg-green-500' : 'bg-red-500'
                    }`}
                    style={{ transform: 'translate(25%, 25%)' }}
                  />
                </div>
                <div className="flex flex-col justify-center flex-grow">
                  <p className="font-semibold truncate text-xs text-dark dark:text-white">
                    {receiver.firstName} {receiver.lastName}
                  </p>
                  <div className="flex items-center space-x-2 text-xs text-black dark:text-white">
                    <p
                      className={`truncate ${
                        !lastMessage.read && !isMyMessage ? 'font-bold' : 'font-normal'
                      }`}
                    >
                      {messageText}
                    </p>
                    <p className="truncate text-[12px]">
                      {getTimeDifference(lastMessage.timestamp)}
                    </p>
                    {!lastMessage.read && !isMyMessage && (
                      <div className="relative">
                        <div className="absolute -top-1 -right-2 w-2 h-2 rounded-full bg-blue-500" />
                      </div>
                    )}
                    {lastMessage.read && isMyMessage && <CheckCheck className="w-3 h-3" />}
                  </div>
                </div>
                <div className="ml-auto items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <CircleEllipsis
                    className="w-4 h-4 text-gray-500 dark:text-gray-300 cursor-pointer transition-colors duration-200"
                    onClick={(e) => {
                      e.stopPropagation()
                      dispatch({ type: 'TOGGLE_MENU', payload: id })
                    }}
                  />
                </div>
              </div>
              <DiscussionMenu
                idDiscussion={id}
                isMenuOpen={isMenuOpen}
                dispatch={dispatch}
                menuRef={menuRef}
              />
            </li>
          )
        })
      ) : null}
      {loadingMoreDiscussions && !isSearching && (
        <LoadingMoreItemsSpinner />
      )}
    </div>
  )
}

export default DiscussionListSearch
