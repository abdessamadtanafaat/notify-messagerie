import React from 'react'
import PopUp from '../common/PopUp'
import { User } from '../../interfaces'
import { useAuth } from '../../contexte/AuthContext'

interface DeleteFriendComponentProps {
  openPopUp: boolean;
  closePopUp: () => void;
  user: User;
  deleteFriend: (userId: string, friendId: string) => void;
}

const DeleteFriendComponent: React.FC<DeleteFriendComponentProps> = ({ openPopUp, closePopUp, user, deleteFriend}) => {
  
  const {user: userAuth} = useAuth()


  const handleDeleteFriend = () => {
    if (userAuth) {
    deleteFriend(userAuth.id,user.id)
    //console.log(`Deleting user with ID: ${user.id}`, `${userAuth.id}`)
    closePopUp() 
  }
}

  return (
    <PopUp
      openPopUp={openPopUp}
      closePopUp={closePopUp}
      title="Confirm Deletion"
      message={`Unfriend ${user.firstName} ${user.lastName}? Are you sure?`}
      onConfirm={handleDeleteFriend}
    />
  )
}

export default DeleteFriendComponent
