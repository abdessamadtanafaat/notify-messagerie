
import { useCallback } from 'react'
import { toast } from 'react-toastify'
import { User } from '../interfaces'
import { Action } from '../components/friends/FriendsReducer'
import userService from '../services/userService'
import { useAuth } from '../contexte/AuthContext'

interface UseDeleteFriendParams {
  user: User | null; // Replace `any` with the appropriate user type if available
  dispatch: React.Dispatch<Action>;
  selectedFriend: User | null; // Replace `any` with the appropriate friend type if available
}

const useDeleteFriend = ({ user, dispatch, selectedFriend }: UseDeleteFriendParams) => {

    const { refreshUserData } = useAuth()
    const deleteFriend = useCallback(
    async (userId: string, friendId: string) => {
      if (selectedFriend) {
        try {
          if (user) {
            const unfriendRequest = { userId, friendId }
            await userService.unfriend(unfriendRequest)
            
             //toast.success(`Successfully unfriended ${friendId} ${friendId}`)

            // Perform necessary actions after unfriending
            dispatch({ type: 'REMOVE_FRIEND', payload: friendId })
          }
        } catch (err) {
          toast.error('Could not unfriend')
        } finally {
          refreshUserData()
          dispatch({ type: 'TOGGLE_POPUP', payload: false })
        }
      }
    },
    [selectedFriend, user, dispatch, refreshUserData]
  )

  return { deleteFriend }
}

export default useDeleteFriend
