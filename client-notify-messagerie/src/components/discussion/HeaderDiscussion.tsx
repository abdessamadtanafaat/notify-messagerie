
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, {  } from 'react'
import { CircleEllipsis, Phone, Video } from 'lucide-react'
import StatusMessage from '../common/StatusMessage'
import { getAvatarUrl } from '../../utils/userUtils'
import { User } from '../../interfaces'
import { useThemeContext } from '../../contexte/ThemeContext'

interface HeaderRectangleProps {
  receiver: User;
  toggleSidebar: () => void;
  typingUser: string | null;
  recordingAudio: string | null;
}

const HeaderDiscussion: React.FC<HeaderRectangleProps> = ({ receiver, toggleSidebar, typingUser, recordingAudio }) => {
  
    const { theme } = useThemeContext()

    return (
    
    <div className="w-full h-12 bg-white dark:bg-gray-800 rounded-lg mt-2 shadow-md">
      <div className="flex items-center justify-between px-5">
        <div className="relative flex items-center space-x-4">
          <div className="relative flex-shrink-0">
            <img
              src={getAvatarUrl(theme, receiver ?? {})}
              alt="Avatar user"
              className="w-24 h-24 md:w-8 md:h-8 rounded-full object-cover border-2 border-gray-300 dark:border-gray-700"
            />
            <div
              className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white dark:border-gray-800 ${receiver.active ? 'bg-green-500' : 'bg-red-500'}`}
              style={{ transform: 'translate(25%, 25%)' }}
            />
          </div>
          <div className="flex flex-col text-xs">
            <p className="font-bold truncate text-dark dark:text-white text-xs">{receiver.firstName} {receiver.lastName}</p>
            {typingUser ? (
              <p className="font-normal truncate text-dark text-green-600 dark:text-light-blue-600 text-xs">Is typing...</p>
            ) : recordingAudio ? (
              <p className="font-normal truncate text-green-600 dark:text-light-blue-600 text-xs">Is Recording...</p>
            ) : (
              <StatusMessage user={receiver} />
            )}
          </div>
        </div>
        <div className="flex space-x-2">
          <button className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
            <Video className="h-5 w-5 text-gray-600 dark:text-gray-300" />
          </button>
          <button className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
            <Phone className="h-5 w-5 text-gray-600 dark:text-gray-300" />
          </button>
          <button onClick={toggleSidebar} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
            <CircleEllipsis className="h-5 w-5 text-gray-600 dark:text-gray-300" />
          </button>
        </div>
      </div>
    </div>

  )
}

export default HeaderDiscussion
