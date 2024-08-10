import React from 'react'
import { User } from '../../interfaces'
import { getTimeDifference } from '../../utils/userUtils'

interface StatusMessageProps {
    user: User
}
const StatusMessage: React.FC<StatusMessageProps> = ({user}) => {

    const statusMessage = user.active 
    ? 'Online'
    : `Online ${getTimeDifference(user.lastLogout)}`
  return (
    <p className="text-black dark:text-white">
      {statusMessage}
    </p>
  )
}

export default StatusMessage
